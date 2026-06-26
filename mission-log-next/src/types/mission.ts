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

export interface MissionLog {
  id: string;
  title: string;
  missionMode: MissionMode;
  crew: string[];
  date: string;
  rawTranscript: string;
  summary: string;
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
  missionMode: MissionMode;
  crew: string;
  transcript: string;
  projectName: string;
  customCategory?: string; // For custom mode
}
