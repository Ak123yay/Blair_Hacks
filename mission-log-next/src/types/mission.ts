export type MissionMode = "custom" | "standard" | "vex" | "hackathon" | "startup" | "research" | "freelance" | "enterprise";

export interface TaskAssignment {
  task: string;
  assignee: string;
  dueDate: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface CommandDecision {
  decision: string;
  rationale: string;
  madeBy: string;
  impact: string;
}

export interface SystemAnomaly {
  problem: string;
  context: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  suggestedFix: string;
}

export interface NotebookPage {
  date: string;
  project: string;
  missionTitle: string;
  teamMembers: string[];
  goal: string;
  startingProblem?: string;
  rootCause?: string;
  changeMade?: string;
  reasoning?: string;
  workCompleted: string;
  problemsEncountered: string[];
  designDecisions: {
    decision: string;
    reason: string;
    alternativesConsidered?: string;
    expectedBenefit?: string;
    evidenceNeeded: string;
  }[];
  testingPerformed: string;
  testProcedure?: string;
  testData?: string;
  evidenceAttached?: string[];
  reflection?: string;
  results: string;
  nextSteps: string[];
  evidenceNeeded: string[];
}

export interface JudgeBrief {
  engineeringChallenge: string;
  designIterations: string[];
  testingEvidence: string[];
  softwareContributions: string[];
  mechanicalContributions: string[];
  teamwork: string;
  likelyQuestions: string[];
}

export interface EvidenceItem {
  type: string;
  description: string;
  relatedTo: string;
  usefulFor: string;
  status: "NEEDED" | "MENTIONED" | "UPLOADED";
}

export interface DesignMemoryEntry {
  question: string;
  answer: string;
  citations: string[];
}

export interface EvidenceClaimMatch {
  claim: string;
  evidence: string;
  status: "Strong" | "Weak" | "Missing";
  source: string;
}

export interface FollowUpQuestion {
  question: string;
  reason: string;
}

export interface DecisionGraphNode {
  id: string;
  label: string;
  detail: string;
  kind: "Problem" | "Decision" | "Evidence" | "Result" | "Next";
}

export interface TestTrial {
  trial: number;
  phase: "Before fix" | "After fix" | "Baseline" | "Retest";
  result: "Success" | "Fail" | "Partial" | "Not documented";
  notes: string;
}

export type MeetingType = "software" | "mechanical" | "testing" | "strategy" | "competition";

export interface MissionLog {
  id: string;
  title: string;
  teamName?: string;
  missionMode: MissionMode;
  meetingType?: MeetingType;
  crew: string[];
  date: string;
  rawTranscript: string;
  summary: string;
  notebookPage?: NotebookPage;
  judgeBrief?: JudgeBrief;
  evidenceVault?: EvidenceItem[];
  designMemory?: DesignMemoryEntry[];
  engineeringNotebookEntry: string;
  commandDecisions: CommandDecision[];
  taskAssignments: TaskAssignment[];
  systemAnomalies: SystemAnomaly[];
  nextMissionGoals: string[];
  proofChecklist: string[];
  judgeRecap: string;
  missingDocumentationWarnings: string[];
  createdAt: string;
  updatedAt: string;
  projectName: string;
}

export interface MissionFormData {
  title: string;
  teamName?: string;
  missionMode: MissionMode;
  meetingType: MeetingType;
  crew: string;
  date: string;
  transcript: string;
  projectName: string;
  customCategory?: string; // For custom mode
}
