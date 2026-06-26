import { MissionMode, TaskAssignment, CommandDecision, SystemAnomaly, MissionLog } from "@/types/mission";
import { v4 as uuidv4 } from "uuid";

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

function getSystemPrompt(mode: MissionMode): string {
  const basePrompt = `You are MissionLog AI, an engineering documentation assistant for student robotics, hackathon, and engineering teams. You analyze meeting transcripts and generate structured, judge-ready engineering documentation.

THEME: You use space mission terminology. Meetings are "Missions", engineering notebooks are "Flight Logs", tasks are "Objectives", team members are "Crew", bugs/problems are "System Anomalies", design decisions are "Command Decisions", and next steps are "Launch Checklist" items.

You MUST respond with valid JSON only. No markdown, no code fences, no extra text. Just the raw JSON object.`;

  const modePrompts: Record<MissionMode, string> = {
    standard: `${basePrompt}

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "A formal engineering notebook entry formatted like: Date, Mission Title, Crew Present, Objectives, Work Completed, Design Changes & Rationale, Test Results, Next Steps. Write in past tense, third person where appropriate. This should be competition-judge quality.",
  "commandDecisions": [{"decision": "what was decided", "rationale": "why it was decided", "madeBy": "who decided or 'Team'", "impact": "expected impact"}],
  "taskAssignments": [{"task": "what needs to be done", "assignee": "person name or 'Unassigned'", "dueDate": "if mentioned or 'Not specified'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "what went wrong or what bug was found", "context": "surrounding context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "how to resolve it"}],
  "nextMissionGoals": ["goal1", "goal2", ...],
  "proofChecklist": ["documentation items that need proof/evidence recorded", "e.g. 'Record PID tuning results'", 'Screenshot of working autonomous path', etc.],
  "judgeRecap": "A paragraph explaining what was accomplished, what changed, and why - suitable for presenting to competition judges",
  "missingDocumentationWarnings": ["warnings about stuff mentioned but not properly documented", "e.g. 'You mentioned testing PID but didn't record the results'"]
}`,

    vex: `${basePrompt}

VEX ROBOTICS MODE: This is a VEX Robotics team meeting. Generate documentation specifically formatted for VEX engineering notebooks. VEX judges look for: clear design process documentation, iteration tracking, test results with data, decision matrices, and evidence of the engineering design process (define problem -> research -> brainstorm -> select -> prototype -> test -> iterate).

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "VEX Engineering Notebook Entry with these sections: **Date & Mission Number**, **Crew Present**, **Problem Definition** (what design challenge was being addressed), **Research & Brainstorming** (ideas discussed), **Design Decision** (what was chosen and WHY with decision matrix if applicable), **Prototype/Build Progress** (what was built/modified with specifics - part names, measurements, code changes), **Testing & Results** (include specific data - distances, times, scores, success rates), **Iteration Notes** (what needs to change based on testing), **Next Steps**. Use formal technical language. Include specific measurements, part numbers, and code references when mentioned.",
  "commandDecisions": [{"decision": "design decision made", "rationale": "engineering justification - why this option over alternatives", "madeBy": "crew member name or 'Team'", "impact": "how this affects the robot design/performance"}],
  "taskAssignments": [{"task": "build/program/test task", "assignee": "crew member or 'Unassigned'", "dueDate": "if mentioned or 'Before next meeting'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "mechanical failure, code bug, or design issue found", "context": "what was happening when discovered", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "proposed solution or troubleshooting step"}],
  "nextMissionGoals": ["specific build/program/test objectives for next session"],
  "proofChecklist": ["VEX-specific documentation items needed: photos of robot, screenshots of code, test data tables, decision matrices, CAD screenshots, match scouting notes"],
  "judgeRecap": "A paragraph suitable for VEX judge interview: what design problem was addressed, what solution was implemented, what data supports the decision, what iteration occurred, and what the result was. Emphasize the engineering design process.",
  "missingDocumentationWarnings": ["VEX-specific warnings like 'You mentioned your autonomous but didn't record timeout values', 'No test data was mentioned for the new drivetrain', 'Design decision lacks comparison to alternatives']
}`,

    hackathon: `${basePrompt}

HACKATHON MODE: This is a hackathon team meeting. Generate documentation for rapid development tracking, demo preparation, and presentation planning.

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "Hackathon Build Log with sections: **Timeline & Sprint** (time block and focus area), **Crew Present & Roles**, **Features Completed** (what was built/working), **Features In Progress** (what's being worked on), **Technical Decisions** (tech stack choices, architecture decisions, tradeoffs), **Blockers & Issues** (what's preventing progress), **Demo Script Progress** (what's ready to demo, what's the demo flow), **Pitch Talking Points** (key points for presentation). Be specific about tech: frameworks used, APIs integrated, features implemented.",
  "commandDecisions": [{"decision": "technical or product decision made", "rationale": "why this approach/technology/feature", "madeBy": "crew member or 'Team'", "impact": "how this affects the build/demo/timeline"}],
  "taskAssignments": [{"task": "feature to build, API to integrate, slide to make, etc.", "assignee": "crew member or 'Unassigned'", "dueDate": "deadline or 'Before demo'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "bug, deployment issue, scope creep, merge conflict, etc.", "context": "surrounding context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "proposed solution or workaround"}],
  "nextMissionGoals": ["features to complete, tests to run, demo prep tasks"],
  "proofChecklist": ["hackathon documentation: working demo recording, GitHub repo link, API documentation, screenshots of key features, deployment URL, pitch deck"],
  "judgeRecap": "A paragraph for hackathon judges: what problem was solved, what tech stack was used, what makes the solution innovative, what was accomplished in the time constraint, and a demo walkthrough summary.",
  "missingDocumentationWarnings": ["hackathon-specific warnings: 'No deployment testing was recorded', 'API error handling not documented', 'Demo flow not practiced', 'No backup plan if live demo fails']"]
}`,
  };

  return modePrompts[mode];
}

function getUserPrompt(transcript: string, crew: string, mode: MissionMode): string {
  const crewList = crew.trim() ? `Crew members present: ${crew}` : "Crew members: extract from transcript context clues or mark as 'Unknown'";

  const modeContext: Record<MissionMode, string> = {
    standard: "This is a general engineering/team meeting. Focus on properly documenting the work discussed.",
    vex: "This is a VEX Robotics team meeting. Pay special attention to robot design changes, programming updates, test results with specific data, and engineering design process documentation that VEX judges expect.",
    hackathon: "This is a hackathon team meeting. Focus on feature progress, technical decisions, demo readiness, and timeline tracking.",
  };

  return `${modeContext[mode]}

${crewList}

MEETING TRANSCRIPT:
---
${transcript}
---

Analyze this transcript and generate the structured documentation. Be thorough and specific. Include actual names, measurements, and technical details when mentioned. If something is vague in the transcript, note it in missingDocumentationWarnings. Remember: respond with valid JSON only, no markdown formatting.`;
}

export async function generateMissionLog(
  transcript: string,
  crew: string,
  mode: MissionMode,
  title: string
): Promise<MissionLog> {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    throw new Error("GLM_API_KEY environment variable is not set");
  }

  const response = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "glm-5.1",
      messages: [
        { role: "system", content: getSystemPrompt(mode) },
        { role: "user", content: getUserPrompt(transcript, crew, mode) },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GLM API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from GLM API");
  }

  let parsed: Record<string, unknown>;
  try {
    const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    parsed = JSON.parse(cleanContent);
  } catch {
    throw new Error(`Failed to parse GLM response as JSON. Raw: ${content.substring(0, 500)}`);
  }

  const mission: MissionLog = {
    id: uuidv4(),
    title,
    missionMode: mode,
    crew: crew.split(",").map((c) => c.trim()).filter(Boolean),
    date: new Date().toISOString(),
    rawTranscript: transcript,
    summary: (parsed.summary as string) || "",
    engineeringNotebookEntry: (parsed.engineeringNotebookEntry as string) || "",
    commandDecisions: (parsed.commandDecisions as CommandDecision[]) || [],
    taskAssignments: (parsed.taskAssignments as TaskAssignment[]) || [],
    systemAnomalies: (parsed.systemAnomalies as SystemAnomaly[]) || [],
    nextMissionGoals: (parsed.nextMissionGoals as string[]) || [],
    proofChecklist: (parsed.proofChecklist as string[]) || [],
    judgeRecap: (parsed.judgeRecap as string) || "",
    missingDocumentationWarnings: (parsed.missingDocumentationWarnings as string[]) || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: "",
  };

  return mission;
}
