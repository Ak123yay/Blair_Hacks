"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Ic } from "@/components/icons/Ic";
import { getDesignMemory } from "@/lib/mission-derived";
import { getMissions } from "@/lib/storage";
import { DesignMemoryEntry, MissionLog } from "@/types/mission";

type MemoryRow = DesignMemoryEntry & {
  missionId: string;
  missionTitle: string;
  projectName: string;
  missionDate: string;
  searchableText: string;
  sourceType: "Decision" | "Notebook" | "Summary";
};

type AiMemoryAnswer = {
  answer: string;
  citations: {
    missionId: string;
    missionTitle: string;
    reason: string;
  }[];
  confidence: "high" | "medium" | "low";
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

function scoreMemory(query: string, memory: MemoryRow) {
  const queryTerms = expandTerms(query);
  if (queryTerms.size === 0) return 0;

  const text = memory.searchableText.toLowerCase();
  const textTerms = expandTerms(memory.searchableText);
  let score = 0;

  for (const term of queryTerms) {
    if (textTerms.has(term)) score += 2;
    if (text.includes(term)) score += 1;
  }

  if (memory.sourceType === "Decision") score += 1;
  return score;
}

export default function DesignMemoryPage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<AiMemoryAnswer | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  const memories = missions.flatMap((mission): MemoryRow[] =>
    [
      ...getDesignMemory(mission).map((memory) => ({
        ...memory,
        missionId: mission.id,
        missionTitle: mission.title,
        projectName: mission.projectName || "Unassigned project",
        missionDate: mission.date,
        searchableText: [
          memory.question,
          memory.answer,
          memory.citations.join(" "),
          mission.summary,
          mission.engineeringNotebookEntry,
          mission.commandDecisions.map((decision) => `${decision.decision} ${decision.rationale} ${decision.impact}`).join(" "),
        ].join(" "),
        sourceType: "Decision" as const,
      })),
      ...(mission.summary
        ? [{
            question: `What happened in ${mission.title}?`,
            answer: mission.summary,
            citations: [mission.title],
            missionId: mission.id,
            missionTitle: mission.title,
            projectName: mission.projectName || "Unassigned project",
            missionDate: mission.date,
            searchableText: `${mission.title} ${mission.summary} ${mission.rawTranscript}`,
            sourceType: "Summary" as const,
          }]
        : []),
      ...(mission.engineeringNotebookEntry
        ? [{
            question: `What did the notebook record for ${mission.title}?`,
            answer: mission.engineeringNotebookEntry,
            citations: [mission.title],
            missionId: mission.id,
            missionTitle: mission.title,
            projectName: mission.projectName || "Unassigned project",
            missionDate: mission.date,
            searchableText: `${mission.title} ${mission.engineeringNotebookEntry} ${mission.rawTranscript}`,
            sourceType: "Notebook" as const,
          }]
        : []),
    ],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return memories;
    return memories
      .map((memory) => ({ memory, score: scoreMemory(query, memory) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ memory }) => memory);
  }, [memories, query]);

  async function askDesignMemory() {
    if (!query.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiAnswer(null);

    try {
      const response = await fetch("/api/memory/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "GLM 5.1 could not answer this question.");
      }

      setAiAnswer(data);
    } catch (error: unknown) {
      setAiError(error instanceof Error ? error.message : "GLM 5.1 could not answer this question.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Design Memory</div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>
          Ask why the team <span className="serif-italic">changed direction</span>
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 12, maxWidth: 680, lineHeight: 1.65 }}>
          Ask a question and GLM 5.1 answers from your saved design memory, notebook entries, and decisions with citations.
        </p>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 20, background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
        <div className="mono" style={{ color: "var(--accent-soft)", marginBottom: 10 }}>Semantic Search Pipeline</div>
        <div className="memory-pipeline">
          {["Logs", "AI summaries", "Memory index", "Question", "Related missions", "Cited answer"].map((step, index) => (
            <div className="memory-pipeline-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
        <p style={{ color: "rgb(255 255 255 / 0.72)", fontSize: 13.5, lineHeight: 1.6, margin: "14px 0 0" }}>
          MissionLog retrieves related memory first, then GLM 5.1 answers only from those saved sources.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          askDesignMemory();
        }}
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}>
            <Ic name="search" size={16} />
          </div>
          <input
            className="input"
            onChange={(event) => {
              setQuery(event.target.value);
              setAiError(null);
            }}
            placeholder="Ask: why did we stop using H-drive, change the drive base, or choose a mechanism?"
            style={{ paddingLeft: 44 }}
            value={query}
          />
        </div>
        <button className="btn btn-accent" disabled={aiLoading || !query.trim()} style={{ minWidth: 150 }} type="submit">
          <Ic name="sparkle" size={14} color="white" />
          {aiLoading ? "Asking..." : "Ask GLM 5.1"}
        </button>
      </form>

      {aiError && (
        <div className="card" style={{ padding: 18, marginBottom: 18, borderColor: "oklch(0.85 0.08 25)", background: "oklch(0.97 0.02 25)" }}>
          <div className="mono" style={{ marginBottom: 6, color: "oklch(0.55 0.10 50)" }}>AI answer failed</div>
          <p style={{ margin: 0, color: "var(--ink-3)", fontSize: 13.5 }}>{aiError}</p>
        </div>
      )}

      {aiAnswer && (
        <div className="card" style={{ padding: 24, marginBottom: 18, background: "var(--accent-softer)", borderColor: "transparent" }}>
          <div className="mono" style={{ marginBottom: 10, color: "var(--accent-ink)", display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="sparkle" size={12} color="var(--accent-ink)" />
            GLM 5.1 Memory Answer - {aiAnswer.confidence} confidence
          </div>
          <p style={{ margin: 0, color: "var(--ink)", fontSize: 15, lineHeight: 1.65 }}>{aiAnswer.answer}</p>
          {aiAnswer.citations.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {aiAnswer.citations.map((citation) => (
                <Link className="badge badge-accent" href={`/mission/${citation.missionId}`} key={`${citation.missionId}-${citation.reason}`}>
                  {citation.missionTitle}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 56, textAlign: "center" }}>
          <Ic name="database" size={30} color="var(--ink-3)" />
          <h2 className="serif" style={{ margin: "14px 0 0", fontSize: 26, fontWeight: 500 }}>No design memory yet</h2>
          <p style={{ color: "var(--ink-3)", fontSize: 13.5 }}>Create missions with design decisions to build memory.</p>
          <Link href="/new" className="btn btn-accent" style={{ marginTop: 18 }}>Create Mission</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((memory) => (
            <Link className="card hover-lift" href={`/mission/${memory.missionId}`} key={`${memory.missionId}-${memory.question}`} style={{ padding: 20 }}>
              <p className="mono" style={{ margin: "0 0 8px" }}>
                {memory.projectName} - {memory.missionTitle} - {memory.sourceType}
              </p>
              <h2 style={{ fontSize: 16, margin: 0 }}>{memory.question}</h2>
              <p style={{ color: "var(--ink-3)", fontSize: 14, lineHeight: 1.6, margin: "10px 0 0" }}>{memory.answer}</p>
              <p className="mono" style={{ fontSize: 9, marginTop: 10 }}>Cites: {memory.citations.join(", ")}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
