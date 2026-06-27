import { NextRequest, NextResponse } from "next/server";
import { getDesignMemory } from "@/lib/mission-derived";
import { rowToMission } from "@/lib/mission-db";
import { createClient } from "@/lib/supabase/server";
import { MissionLog } from "@/types/mission";

const NVIDIA_NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const RETRYABLE_NIM_STATUS = new Set([429, 503, 504]);

type MemoryChunk = {
  missionId: string;
  missionTitle: string;
  projectName: string;
  date: string;
  sourceType: "Design Memory" | "Decision" | "Notebook" | "Summary";
  question: string;
  content: string;
  searchableText: string;
};

const semanticGroups = [
  ["drive", "drivetrain", "drivebase", "base", "h-drive", "tank", "strafe", "strafing", "chassis"],
  ["change", "changed", "switch", "switched", "replace", "replaced", "iteration", "stop", "stopped"],
  ["why", "because", "rationale", "reason", "decision", "choose", "chosen", "chose"],
  ["test", "testing", "trial", "data", "evidence", "result", "results", "reliability"],
  ["autonomous", "auto", "program", "code", "software", "control"],
  ["mechanism", "intake", "arm", "lift", "claw", "launcher"],
];

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function expandTerms(value: string) {
  const terms = new Set(tokenize(value));

  for (const group of semanticGroups) {
    if (group.some((term) => terms.has(term))) {
      group.forEach((term) => terms.add(term));
    }
  }

  return terms;
}

function scoreChunk(question: string, chunk: MemoryChunk) {
  const questionTerms = expandTerms(question);
  const text = chunk.searchableText.toLowerCase();
  const textTerms = expandTerms(chunk.searchableText);
  let score = 0;

  for (const term of questionTerms) {
    if (textTerms.has(term)) score += 2;
    if (text.includes(term)) score += 1;
  }

  if (chunk.sourceType === "Design Memory") score += 3;
  if (chunk.sourceType === "Decision") score += 2;
  return score;
}

function buildChunks(mission: MissionLog): MemoryChunk[] {
  const projectName = mission.projectName || "Unassigned project";
  const decisionText = mission.commandDecisions
    .map((decision) => `${decision.decision}. Rationale: ${decision.rationale}. Impact: ${decision.impact}.`)
    .join(" ");

  return [
    ...getDesignMemory(mission).map((memory): MemoryChunk => ({
      missionId: mission.id,
      missionTitle: mission.title,
      projectName,
      date: mission.date,
      sourceType: "Design Memory",
      question: memory.question,
      content: memory.answer,
      searchableText: `${memory.question} ${memory.answer} ${memory.citations.join(" ")} ${decisionText} ${mission.summary}`,
    })),
    ...mission.commandDecisions.map((decision): MemoryChunk => ({
      missionId: mission.id,
      missionTitle: mission.title,
      projectName,
      date: mission.date,
      sourceType: "Decision",
      question: decision.decision,
      content: `Decision: ${decision.decision}. Rationale: ${decision.rationale}. Made by: ${decision.madeBy}. Impact: ${decision.impact}.`,
      searchableText: `${decision.decision} ${decision.rationale} ${decision.madeBy} ${decision.impact} ${mission.summary}`,
    })),
    ...(mission.engineeringNotebookEntry
      ? [{
          missionId: mission.id,
          missionTitle: mission.title,
          projectName,
          date: mission.date,
          sourceType: "Notebook" as const,
          question: `Notebook entry for ${mission.title}`,
          content: mission.engineeringNotebookEntry,
          searchableText: `${mission.title} ${mission.engineeringNotebookEntry} ${mission.rawTranscript}`,
        }]
      : []),
    ...(mission.summary
      ? [{
          missionId: mission.id,
          missionTitle: mission.title,
          projectName,
          date: mission.date,
          sourceType: "Summary" as const,
          question: `Summary of ${mission.title}`,
          content: mission.summary,
          searchableText: `${mission.title} ${mission.summary} ${mission.rawTranscript}`,
        }]
      : []),
  ];
}

function parseJsonObject(content: string) {
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return JSON.parse(start >= 0 && end >= start ? cleaned.slice(start, end + 1) : cleaned) as Record<string, unknown>;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function askGlmWithRetry(apiKey: string, body: Record<string, unknown>) {
  const delays = [500, 1200, 2500];
  let lastErrorText = "";
  let lastStatus = 0;

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    const response = await fetch(NVIDIA_NIM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return response;
    }

    lastStatus = response.status;
    lastErrorText = await response.text();

    if (!RETRYABLE_NIM_STATUS.has(response.status) || attempt === delays.length) {
      break;
    }

    await wait(delays[attempt]);
  }

  const busyMessage = RETRYABLE_NIM_STATUS.has(lastStatus)
    ? "GLM 5.1 is temporarily busy on NVIDIA NIM. Please retry in a moment."
    : `NVIDIA NIM API error (${lastStatus}): ${lastErrorText}`;

  throw new Error(busyMessage);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NVIDIA_NIM_API_KEY environment variable is not set" }, { status: 500 });
  }

  const { question } = await request.json() as { question?: string };
  const trimmedQuestion = question?.trim();
  if (!trimmedQuestion) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const missions = ((data || []) as Record<string, unknown>[]).map((row) => rowToMission(row));
  const chunks = missions.flatMap(buildChunks);
  const rankedChunks = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(trimmedQuestion, chunk) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ chunk }) => chunk);

  if (rankedChunks.length === 0) {
    return NextResponse.json({
      answer: "I could not find enough related design memory to answer that from your saved missions yet.",
      citations: [],
      confidence: "low",
    });
  }

  const context = rankedChunks
    .map(
      (chunk, index) =>
        `[${index + 1}] ${chunk.missionTitle} (${chunk.projectName}, ${chunk.date}, ${chunk.sourceType})\n${chunk.content}`,
    )
    .join("\n\n");

  let response: Response;
  try {
    response = await askGlmWithRetry(apiKey, {
      model: "z-ai/glm-5.1",
      messages: [
        {
          role: "system",
          content:
            "You are MissionLog Design Memory AI. Answer the user's question only from the retrieved mission context. If the context is weak, say what is missing. Be concise, factual, and cite mission titles. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Question: ${trimmedQuestion}\n\nRetrieved mission context:\n${context}\n\nReturn JSON with this exact shape:\n{"answer":"2-5 sentence answer grounded only in the context","citations":[{"missionId":"id from context","missionTitle":"title from context","reason":"short reason this source supports the answer"}],"confidence":"high|medium|low"}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 900,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GLM 5.1 request failed." },
      { status: 502 },
    );
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "No content returned from GLM 5.1" }, { status: 502 });
  }

  try {
    const parsed = parseJsonObject(content);
    return NextResponse.json({
      answer: typeof parsed.answer === "string" ? parsed.answer : "GLM 5.1 returned an incomplete answer.",
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
      confidence: parsed.confidence || "medium",
      retrieved: rankedChunks.map((chunk) => ({
        missionId: chunk.missionId,
        missionTitle: chunk.missionTitle,
        sourceType: chunk.sourceType,
      })),
    });
  } catch {
    return NextResponse.json({
      answer: content,
      citations: rankedChunks.slice(0, 3).map((chunk) => ({
        missionId: chunk.missionId,
        missionTitle: chunk.missionTitle,
        reason: chunk.sourceType,
      })),
      confidence: "medium",
    });
  }
}
