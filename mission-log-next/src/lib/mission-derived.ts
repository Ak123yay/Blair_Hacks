import {
  CommandDecision,
  DesignMemoryEntry,
  EvidenceItem,
  JudgeBrief,
  MissionLog,
  NotebookPage,
} from "@/types/mission";

function sentenceFallback(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export function getNotebookPage(mission: MissionLog): NotebookPage {
  if (mission.notebookPage) return mission.notebookPage;

  return {
    date: mission.date,
    project: mission.projectName || "Unassigned project",
    missionTitle: mission.title,
    teamMembers: mission.crew.length > 0 ? mission.crew : ["Unknown"],
    goal: sentenceFallback(
      mission.summary,
      "Document the meeting outcome and identify the next engineering step.",
    ),
    workCompleted: sentenceFallback(
      mission.engineeringNotebookEntry,
      "Work completed was not specific enough in the notes. Add details before final notebook export.",
    ),
    problemsEncountered: mission.systemAnomalies.map((item) => item.problem),
    designDecisions: mission.commandDecisions.map((decision) => ({
      decision: decision.decision,
      reason: decision.rationale,
      evidenceNeeded: decision.impact || "Add supporting evidence.",
    })),
    testingPerformed:
      mission.proofChecklist.find((item) => /test|trial|data|video/i.test(item)) ||
      "Testing was not clearly documented.",
    results: sentenceFallback(
      mission.judgeRecap,
      "Results need stronger data before this page is judge-ready.",
    ),
    nextSteps: mission.nextMissionGoals,
    evidenceNeeded: mission.missingDocumentationWarnings.length
      ? mission.missingDocumentationWarnings
      : mission.proofChecklist,
  };
}

export function getEvidenceVault(mission: MissionLog): EvidenceItem[] {
  if (mission.evidenceVault?.length) return mission.evidenceVault;

  const fromProof = mission.proofChecklist.map((item) => ({
    type: inferEvidenceType(item),
    description: item,
    relatedTo: mission.title,
    usefulFor: /judge|notebook|test|data/i.test(item)
      ? "Engineering notebook / judging"
      : "Project history",
    status: "NEEDED" as const,
  }));

  const fromWarnings = mission.missingDocumentationWarnings.map((item) => ({
    type: inferEvidenceType(item),
    description: item,
    relatedTo: mission.title,
    usefulFor: "Missing evidence detector",
    status: "NEEDED" as const,
  }));

  return [...fromProof, ...fromWarnings];
}

export function getJudgeBrief(mission: MissionLog): JudgeBrief {
  if (mission.judgeBrief) return mission.judgeBrief;

  const notebook = getNotebookPage(mission);
  const decisions = mission.commandDecisions.map((decision) => `${decision.decision}: ${decision.rationale}`);

  return {
    engineeringChallenge: notebook.goal,
    designIterations: decisions.length ? decisions : ["No design iteration was documented yet."],
    testingEvidence: notebook.evidenceNeeded.length
      ? notebook.evidenceNeeded
      : ["Add test data, photos, videos, or code screenshots."],
    softwareContributions: findContributions(mission, /code|software|program|autonomous|api|deploy/i),
    mechanicalContributions: findContributions(mission, /robot|drive|intake|arm|cad|build|mechanical/i),
    teamwork: mission.crew.length
      ? `${mission.crew.join(", ")} contributed to this mission.`
      : "Crew contributions were not clearly documented.",
    likelyQuestions: [
      "What problem were you trying to solve in this mission?",
      "What data supports the design decision?",
      "What changed between this mission and the previous one?",
      "What evidence can you show for the testing claim?",
      "What will the team improve next?",
    ],
  };
}

export function getDesignMemory(mission: MissionLog): DesignMemoryEntry[] {
  if (mission.designMemory?.length) return mission.designMemory;

  return mission.commandDecisions.map((decision: CommandDecision) => ({
    question: `Why did the team choose ${decision.decision}?`,
    answer: `The team chose ${decision.decision} because ${decision.rationale}. Expected impact: ${decision.impact}.`,
    citations: [mission.title],
  }));
}

export function getJudgeReadinessScore(mission: MissionLog) {
  const notebook = getNotebookPage(mission);
  let score = 20;

  if (mission.summary) score += 10;
  if (mission.engineeringNotebookEntry) score += 15;
  if (mission.commandDecisions.length) score += 15;
  if (mission.taskAssignments.length) score += 10;
  if (mission.proofChecklist.length) score += 10;
  if (notebook.testingPerformed && !/not clearly documented/i.test(notebook.testingPerformed)) score += 10;
  if (!mission.missingDocumentationWarnings.length) score += 10;

  return Math.min(100, score);
}

export function getNotebookHtml(mission: MissionLog) {
  const page = getNotebookPage(mission);
  const escapeHtml = (value: unknown) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const list = (items: string[]) =>
    items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>Not specified.</p>";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(page.missionTitle)}</title>
  <style>
    @page { size: Letter; margin: 0.6in; }
    body { color: #111827; font-family: Arial, sans-serif; line-height: 1.5; }
    h1 { font-size: 24px; margin: 0 0 4px; }
    h2 { border-bottom: 1px solid #d1d5db; font-size: 15px; margin-top: 22px; padding-bottom: 4px; }
    .meta { color: #4b5563; font-size: 12px; margin-bottom: 20px; }
    table { border-collapse: collapse; margin-top: 8px; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <h1>${escapeHtml(page.missionTitle)}</h1>
  <div class="meta">Project: ${escapeHtml(page.project)} | Date: ${escapeHtml(new Date(page.date).toLocaleDateString())}</div>
  <h2>Team Members Present</h2>
  <p>${page.teamMembers.map(escapeHtml).join(", ")}</p>
  <h2>Goal</h2>
  <p>${escapeHtml(page.goal)}</p>
  <h2>Work Completed</h2>
  <p>${escapeHtml(page.workCompleted)}</p>
  <h2>Problems Encountered</h2>
  ${list(page.problemsEncountered)}
  <h2>Design Decisions</h2>
  <table>
    <thead><tr><th>Decision</th><th>Reason</th><th>Evidence Needed</th></tr></thead>
    <tbody>
      ${page.designDecisions
        .map(
          (decision) =>
            `<tr><td>${escapeHtml(decision.decision)}</td><td>${escapeHtml(decision.reason)}</td><td>${escapeHtml(decision.evidenceNeeded)}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <h2>Testing Performed</h2>
  <p>${escapeHtml(page.testingPerformed)}</p>
  <h2>Results</h2>
  <p>${escapeHtml(page.results)}</p>
  <h2>Next Steps</h2>
  ${list(page.nextSteps)}
  <h2>Evidence Needed</h2>
  ${list(page.evidenceNeeded)}
</body>
</html>`;
}

function inferEvidenceType(value: string) {
  if (/video|record/i.test(value)) return "Test video";
  if (/photo|image|picture/i.test(value)) return "Photo evidence";
  if (/code|github|commit|screenshot/i.test(value)) return "Code evidence";
  if (/data|table|trial|score/i.test(value)) return "Testing data";
  if (/cad|diagram|design/i.test(value)) return "Design artifact";
  return "Notebook evidence";
}

function findContributions(mission: MissionLog, pattern: RegExp) {
  const matches = [
    ...mission.taskAssignments.map((task) => task.task),
    ...mission.commandDecisions.map((decision) => decision.decision),
    mission.engineeringNotebookEntry,
  ].filter((value) => pattern.test(value));

  return matches.length ? matches.slice(0, 4) : ["No contribution details were documented yet."];
}
