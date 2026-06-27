import {
  CommandDecision,
  DecisionGraphNode,
  DesignMemoryEntry,
  EvidenceClaimMatch,
  EvidenceItem,
  FollowUpQuestion,
  JudgeBrief,
  MissionLog,
  NotebookPage,
  TestTrial,
} from "@/types/mission";
import { getMetadataQuality, isRealText } from "@/lib/mission-quality";

function sentenceFallback(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export function getNotebookPage(mission: MissionLog): NotebookPage {
  if (mission.notebookPage) {
    return normalizeNotebookPage({
      ...mission.notebookPage,
      date: mission.date || mission.notebookPage.date,
      project: mission.projectName || mission.notebookPage.project || "Unassigned project",
      missionTitle: mission.title || mission.notebookPage.missionTitle,
      teamMembers: mission.crew.length > 0 ? mission.crew : mission.notebookPage.teamMembers,
    });
  }

  return normalizeNotebookPage({
    date: mission.date,
    project: mission.projectName || "Unassigned project",
    missionTitle: mission.title,
    teamMembers: mission.crew.length > 0 ? mission.crew : ["Unknown"],
    goal: sentenceFallback(
      mission.summary,
      "Document the meeting outcome and identify the next engineering step.",
    ),
    startingProblem: mission.systemAnomalies[0]?.problem || "Not documented",
    rootCause: mission.systemAnomalies[0]?.context || "Not documented",
    changeMade: mission.commandDecisions[0]?.decision || "Not documented",
    reasoning: mission.commandDecisions[0]?.rationale || "Not documented",
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
    testProcedure:
      mission.proofChecklist.find((item) => /test|trial|procedure|verify|field/i.test(item)) ||
      "Not documented",
    testData:
      mission.proofChecklist.find((item) => /\b\d+\b|trial|success|fail|data|table|score|degree|inch|second/i.test(item)) ||
      "Not documented",
    evidenceAttached: getEvidenceVault(mission)
      .filter((item) => item.status === "UPLOADED")
      .map((item) => item.description),
    reflection: mission.nextMissionGoals[0] || "Not documented",
    results: sentenceFallback(
      mission.judgeRecap,
      "Results need stronger data before this page is judge-ready.",
    ),
    nextSteps: mission.nextMissionGoals,
    evidenceNeeded: mission.missingDocumentationWarnings.length
      ? mission.missingDocumentationWarnings
      : mission.proofChecklist,
  });
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
  return getJudgeReadinessReport(mission).score;
}

export function getJudgeReadinessReport(mission: MissionLog) {
  const notebook = getNotebookPage(mission);
  const claimMatches = getEvidenceClaimMatches(mission);
  const missing: string[] = [];
  let score = 20;

  if (mission.summary) score += 10;
  else missing.push("Add a concise mission summary.");

  if (mission.engineeringNotebookEntry) score += 15;
  else missing.push("Generate a full engineering notebook entry.");

  if (mission.commandDecisions.length) score += 15;
  else missing.push("Record at least one design or technical decision.");

  if (mission.taskAssignments.length) score += 10;
  else missing.push("Assign next objectives to specific crew members.");

  if (mission.proofChecklist.length) score += 10;
  else missing.push("Add a proof checklist for photos, videos, code, or data.");

  if (notebook.testingPerformed && !/not clearly documented/i.test(notebook.testingPerformed)) score += 10;
  else missing.push("Document the test method, number of trials, and result.");

  if (!mission.missingDocumentationWarnings.length) score += 10;
  else missing.push(...mission.missingDocumentationWarnings.slice(0, 3));

  const supportedClaims = claimMatches.filter((match) => match.status !== "Missing").length;
  if (claimMatches.length && supportedClaims === claimMatches.length) score += 10;
  else if (claimMatches.some((match) => match.status === "Missing")) {
    missing.push("Attach evidence for claims marked as missing.");
  }

  return {
    score: Math.min(100, score),
    missing: uniqueStrings(missing).slice(0, 6),
  };
}

export function getNotebookQualityReport(mission: MissionLog) {
  const notebook = getNotebookPage(mission);
  const evidenceVault = getEvidenceVault(mission);
  const metadata = getMetadataQuality(mission);
  const missing: string[] = [];
  const blockingMissing: string[] = [];
  let score = 0;

  if (metadata.valid) score += 10;
  else missing.push(...metadata.missing);

  if (isSpecific(notebook.startingProblem)) score += 15;
  else missing.push("Specific starting problem");

  if (isSpecific(notebook.rootCause)) score += 15;
  else {
    missing.push("Investigation / diagnosis");
    blockingMissing.push("Investigation / diagnosis");
  }

  if (isSpecific(notebook.changeMade) || mission.commandDecisions.length) score += 15;
  else missing.push("Specific fix or design/code change");

  if (isSpecific(notebook.testProcedure)) score += 15;
  else {
    missing.push("Testing procedure");
    blockingMissing.push("Testing procedure");
  }

  if (isSpecific(notebook.testData) && hasConcreteTestData(notebook.testData)) score += 15;
  else {
    missing.push("Results/data");
    blockingMissing.push("Results/data");
  }

  if (evidenceVault.some((item) => item.status === "UPLOADED")) score += 15;
  else {
    missing.push("Evidence");
    blockingMissing.push("Evidence");
  }

  if (!isSpecific(notebook.reflection)) {
    missing.push("Reflection");
    blockingMissing.push("Reflection");
  }

  return {
    score: Math.min(100, score),
    missing: uniqueStrings(missing).slice(0, 8),
    blockingMissing: uniqueStrings(blockingMissing),
    readyForFinal: score >= 70 && blockingMissing.length === 0,
  };
}

export function getNotebookMode(mission: MissionLog) {
  const report = getNotebookQualityReport(mission);
  if (report.readyForFinal) return "Final Notebook Page";
  if (report.blockingMissing.some((item) => /testing|results|evidence/i.test(item))) return "Draft - Needs Testing Data";
  return "Draft - Needs Engineering Detail";
}

export function getEvidenceClaimMatches(mission: MissionLog): EvidenceClaimMatch[] {
  const notebook = getNotebookPage(mission);
  const evidenceVault = getEvidenceVault(mission);
  const claims = uniqueStrings([
    ...mission.systemAnomalies.map((item) => item.problem),
    ...mission.commandDecisions.map((item) => item.decision),
    notebook.testingPerformed,
    notebook.results,
    mission.judgeRecap,
  ].map(cleanJudgeFacingText)).filter((claim) => claim && !/not clearly documented|not specified|not documented/i.test(claim));

  return claims.slice(0, 8).map((claim) => {
    const evidence = findEvidenceForClaim(claim, evidenceVault, mission);
    return {
      claim,
      evidence: evidence.description,
      status: evidence.status,
      source: evidence.source,
    };
  });
}

export function getFollowUpQuestions(mission: MissionLog): FollowUpQuestion[] {
  const notebook = getNotebookPage(mission);
  const claimMatches = getEvidenceClaimMatches(mission);
  const questions: FollowUpQuestion[] = [];
  const projectText = `${mission.title} ${mission.rawTranscript} ${notebook.goal} ${notebook.workCompleted}`.toLowerCase();

  if (/h-?drive|tank drive|drivetrain|intake/.test(projectText)) {
    questions.push(
      {
        question: "Which drivetrain did the team choose after testing?",
        reason: "The design decision needs to say whether tank drive won, H-drive won, or no final decision was made.",
      },
      {
        question: "How many H-drive and tank drive trial runs were completed?",
        reason: "Trial count is required before this can be treated as completed testing.",
      },
      {
        question: "What were the average cycle times and autonomous success rates for each drivetrain?",
        reason: "Judges need comparative numbers, not just a planned comparison.",
      },
      {
        question: "What was the intake success rate for each tested configuration?",
        reason: "The intake claim needs measured results tied to the drivetrain or modification tested.",
      },
      {
        question: "Did the team record a video, photo, code diff, or field log from the practice test?",
        reason: "Evidence must be attached or linked before a claim can be marked Strong.",
      },
    );
  }

  claimMatches
    .filter((match) => match.status === "Missing")
    .slice(0, 3)
    .forEach((match) => {
      questions.push({
        question: `What exact data or artifact supports: "${shorten(match.claim, 96)}"?`,
        reason: "This claim is visible in the notebook but has no attached proof yet.",
      });
    });

  if (!isSpecific(notebook.testProcedure) || !isSpecific(notebook.testData)) {
    questions.push({
      question: "What test procedure was used, and what stayed the same between trials?",
      reason: "A final notebook page needs repeatable testing conditions.",
    });
    questions.push({
      question: "What were the actual results for each trial?",
      reason: "Pass/fail results, times, scores, or measurements are required for final export.",
    });
  }

  if (!mission.commandDecisions.length) {
    questions.push({
      question: "What decision did the team make, and what alternatives were rejected?",
      reason: "Design process needs a traceable decision, not just completed work.",
    });
  }

  if (!mission.crew.length || mission.crew.includes("Unknown")) {
    questions.push({
      question: "Who worked on each software, build, testing, or documentation task?",
      reason: "Role clarity improves both the notebook and judge brief.",
    });
  }

  return uniqueQuestions(questions).slice(0, 5);
}

export function getDecisionGraph(mission: MissionLog): DecisionGraphNode[] {
  const notebook = getNotebookPage(mission);
  const evidenceVault = getEvidenceVault(mission);
  const firstProblem = mission.systemAnomalies[0]?.problem || notebook.problemsEncountered[0] || "Project requirement or design challenge";
  const firstEvidence = evidenceVault[0]?.description || notebook.evidenceNeeded[0] || "Supporting evidence still needed";
  const firstNext = mission.nextMissionGoals[0] || notebook.nextSteps[0] || "Define the next engineering iteration";

  if (!mission.commandDecisions.length) {
    return [
      graphNode("problem", "Problem", firstProblem, "Document the engineering problem before the next iteration."),
      graphNode("evidence", "Evidence", firstEvidence, "Collect proof that explains the current state."),
      graphNode("next", "Next", firstNext, "Use the evidence to choose the next decision."),
    ];
  }

  return mission.commandDecisions.slice(0, 3).flatMap((decision, index) => [
    graphNode(`problem-${index}`, "Problem", index === 0 ? firstProblem : "Previous iteration constraint", decision.rationale),
    graphNode(`decision-${index}`, "Decision", decision.decision, decision.impact || "Impact needs to be measured."),
    graphNode(`evidence-${index}`, "Evidence", evidenceVault[index]?.description || firstEvidence, evidenceVault[index]?.status || "NEEDED"),
    graphNode(`result-${index}`, "Result", notebook.results, "Result should be backed by test data."),
    graphNode(`next-${index}`, "Next", mission.nextMissionGoals[index] || firstNext, "Next documented iteration."),
  ]);
}

export function getTestingTable(mission: MissionLog): TestTrial[] {
  const notebook = getNotebookPage(mission);
  const source = `${mission.rawTranscript}\n${notebook.testingPerformed}\n${notebook.testData || ""}\n${notebook.results}`;
  const trialCount = source.match(/\b(\d+)\s+(?:out of|\/)\s+(\d+)\b/i);

  if (trialCount) {
    const successes = Number(trialCount[1]);
    const total = Number(trialCount[2]);
    if (Number.isFinite(successes) && Number.isFinite(total) && total > 0 && total <= 20) {
      return Array.from({ length: total }, (_, index) => ({
        trial: index + 1,
        phase: "After fix",
        result: index < successes ? "Success" : "Fail",
        notes: index < successes ? "Reported as successful in notes." : "Reported as unsuccessful or incomplete in notes.",
      }));
    }
  }

  if (!hasTestingLanguage(source)) return [];

  return [{
    trial: 1,
    phase: "Retest",
    result: "Not documented",
    notes: "Testing was mentioned, but trial-by-trial data was not documented.",
  }];
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
  <div class="meta">Project: ${escapeHtml(page.project)} | Date: ${escapeHtml(formatDate(page.date))} | Mode: ${escapeHtml(getNotebookMode(mission))}</div>
  <h2>Team Members</h2>
  <p>${page.teamMembers.map(escapeHtml).join(", ")}</p>
  <h2>1. Objective</h2>
  <p>${escapeHtml(page.goal)}</p>
  <h2>2. Starting Problem</h2>
  <p>${escapeHtml(page.startingProblem || "Not documented")}</p>
  <h2>3. Investigation / Diagnosis</h2>
  <p>${escapeHtml(page.rootCause || "Not documented")}</p>
  <h2>4. Work Completed</h2>
  <p>${escapeHtml(page.workCompleted)}</p>
  <h2>5. Design or Code Decisions</h2>
  <table>
    <thead><tr><th>Decision</th><th>Reason</th><th>Alternatives</th><th>Expected Benefit</th><th>Evidence Needed</th></tr></thead>
    <tbody>
      ${page.designDecisions
        .map(
          (decision) =>
            `<tr><td>${escapeHtml(decision.decision)}</td><td>${escapeHtml(decision.reason)}</td><td>${escapeHtml(decision.alternativesConsidered || "Not documented")}</td><td>${escapeHtml(decision.expectedBenefit || "Not documented")}</td><td>${escapeHtml(decision.evidenceNeeded)}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <h2>6. Testing Procedure</h2>
  <p>${escapeHtml(page.testProcedure || page.testingPerformed || "Not documented")}</p>
  <h2>7. Results / Data</h2>
  <p>${escapeHtml(page.testData || page.results || "Not documented")}</p>
  ${testingTableHtml(getTestingTable(mission), escapeHtml)}
  <h2>8. Evidence Attached</h2>
  ${list(page.evidenceAttached?.length ? page.evidenceAttached : ["No actual evidence attached yet."])}
  <h2>9. Reflection</h2>
  <p>${escapeHtml(page.reflection || "Not documented")}</p>
  <h2>10. Next Steps</h2>
  ${list(page.nextSteps)}
  <h2>Evidence-to-Claim Matches</h2>
  <table>
    <thead><tr><th>Claim</th><th>Evidence</th><th>Status</th></tr></thead>
    <tbody>
      ${getEvidenceClaimMatches(mission)
        .map(
          (match) =>
            `<tr><td>${escapeHtml(match.claim)}</td><td>${escapeHtml(match.evidence)}</td><td>${escapeHtml(match.status)}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <h2>AI Follow-Up Questions</h2>
  ${list(getFollowUpQuestions(mission).map((item) => `${item.question} ${item.reason}`))}
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

function findEvidenceForClaim(claim: string, evidenceVault: EvidenceItem[], mission: MissionLog) {
  const claimTokens = tokens(claim);
  const evidenceMatch = evidenceVault.find((item) => {
    const text = `${item.type} ${item.description} ${item.relatedTo} ${item.usefulFor}`;
    return overlapScore(claimTokens, tokens(text)) >= 2;
  });

  if (evidenceMatch) {
    if (evidenceMatch.status === "UPLOADED") {
      return {
        description: evidenceMatch.description,
        status: "Strong" as const,
        source: evidenceMatch.type,
      };
    }

    if (evidenceMatch.status === "MENTIONED") {
      return {
        description: evidenceMatch.description,
        status: "Weak" as const,
        source: evidenceMatch.type,
      };
    }

    return {
      description: evidenceMatch.description,
      status: "Missing" as const,
      source: evidenceMatch.type,
    };
  }

  const transcriptHasClaim = overlapScore(claimTokens, tokens(mission.rawTranscript)) >= 3;
  if (transcriptHasClaim) {
    return {
      description: "Mentioned in notes, but no artifact is attached.",
      status: "Weak" as const,
      source: "Transcript",
    };
  }

  return {
    description: "No matching evidence found.",
    status: "Missing" as const,
    source: "Evidence vault",
  };
}

function graphNode(id: string, kind: DecisionGraphNode["kind"], label: string, detail: string): DecisionGraphNode {
  return { id, kind, label: shorten(label, 90), detail: shorten(detail, 120) };
}

function tokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3 && !["that", "with", "from", "this", "were", "have", "will", "been"].includes(token));
}

function overlapScore(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.filter((token) => rightSet.has(token)).length;
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function uniqueQuestions(items: FollowUpQuestion[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.question)) return false;
    seen.add(item.question);
    return true;
  });
}

function shorten(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3).trim()}...`;
}

function isSpecific(value: string | undefined) {
  return isRealText(value, 8) && !/not documented|not clearly documented|not specified|needs stronger data/i.test(value || "");
}

function hasTestingLanguage(value: string | undefined) {
  return /trial|test|success|fail|before|after|score|degree|inch|second|data|measured|verified/i.test(value || "");
}

function hasConcreteTestData(value: string | undefined) {
  return hasTestingLanguage(value) && /\b\d+(\.\d+)?\b|%|\b\d+\s*\/\s*\d+\b|\b\d+\s+out of\s+\d+\b/i.test(value || "");
}

function normalizeNotebookPage(page: NotebookPage): NotebookPage {
  return {
    ...page,
    goal: cleanJudgeFacingText(page.goal),
    startingProblem: cleanJudgeFacingText(page.startingProblem || "Not documented"),
    rootCause: cleanJudgeFacingText(page.rootCause || "Not documented"),
    changeMade: cleanJudgeFacingText(page.changeMade || "Not documented"),
    reasoning: cleanJudgeFacingText(page.reasoning || "Not documented"),
    workCompleted: cleanJudgeFacingText(page.workCompleted),
    problemsEncountered: page.problemsEncountered.map(cleanJudgeFacingText),
    designDecisions: page.designDecisions.map((decision) => ({
      ...decision,
      decision: cleanJudgeFacingText(decision.decision),
      reason: cleanJudgeFacingText(decision.reason),
      alternativesConsidered: cleanJudgeFacingText(decision.alternativesConsidered || "Not documented"),
      expectedBenefit: cleanJudgeFacingText(decision.expectedBenefit || "Not documented"),
      evidenceNeeded: cleanJudgeFacingText(decision.evidenceNeeded),
    })),
    testingPerformed: cleanJudgeFacingText(page.testingPerformed),
    testProcedure: cleanJudgeFacingText(page.testProcedure || "Not documented"),
    testData: cleanJudgeFacingText(page.testData || "Not documented"),
    evidenceAttached: (page.evidenceAttached || []).map(cleanJudgeFacingText),
    reflection: cleanJudgeFacingText(page.reflection || "Not documented"),
    results: cleanJudgeFacingText(page.results),
    nextSteps: page.nextSteps.map(cleanJudgeFacingText),
    evidenceNeeded: page.evidenceNeeded.map(cleanJudgeFacingText),
  };
}

function cleanJudgeFacingText(value: string) {
  const text = value.trim();
  if (/transcript truncated/i.test(text)) {
    return "The transcript did not include final test results or a final design decision.";
  }

  return text
    .replace(/transcript truncated[^.]*\.?/gi, "The transcript did not include final test results or a final design decision.")
    .replace(/\bdebug\b/gi, "missing documentation")
    .trim();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Not documented";
  return date.toLocaleDateString();
}

function testingTableHtml(trials: TestTrial[], escapeHtml: (value: unknown) => string) {
  if (!trials.length) return "";

  return `<table>
    <thead><tr><th>Trial</th><th>Before/After</th><th>Result</th><th>Notes</th></tr></thead>
    <tbody>
      ${trials
        .map(
          (trial) =>
            `<tr><td>${trial.trial}</td><td>${escapeHtml(trial.phase)}</td><td>${escapeHtml(trial.result)}</td><td>${escapeHtml(trial.notes)}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>`;
}
