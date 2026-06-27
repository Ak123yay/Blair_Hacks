import { MissionLog } from "@/types/mission";

type MissionRow = {
  id: string;
  title: string;
  mission_mode: MissionLog["missionMode"];
  crew: MissionLog["crew"];
  date: string;
  raw_transcript: string;
  summary: string;
  engineering_notebook_entry: string;
  command_decisions: MissionLog["commandDecisions"];
  task_assignments: MissionLog["taskAssignments"];
  system_anomalies: MissionLog["systemAnomalies"];
  next_mission_goals: MissionLog["nextMissionGoals"];
  proof_checklist: MissionLog["proofChecklist"];
  judge_recap: string;
  missing_documentation_warnings: MissionLog["missingDocumentationWarnings"];
  created_at: string;
  updated_at: string;
  project_name: string;
  user_id?: string;
};

function asArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function missionToRow(mission: MissionLog, userId: string): MissionRow {
  const now = new Date().toISOString();

  return {
    id: mission.id,
    title: mission.title,
    mission_mode: mission.missionMode,
    crew: mission.crew,
    date: mission.date,
    raw_transcript: mission.rawTranscript,
    summary: mission.summary,
    engineering_notebook_entry: mission.engineeringNotebookEntry,
    command_decisions: mission.commandDecisions,
    task_assignments: mission.taskAssignments,
    system_anomalies: mission.systemAnomalies,
    next_mission_goals: mission.nextMissionGoals,
    proof_checklist: mission.proofChecklist,
    judge_recap: mission.judgeRecap,
    missing_documentation_warnings: mission.missingDocumentationWarnings,
    created_at: mission.createdAt || now,
    updated_at: now,
    project_name: mission.projectName,
    user_id: userId,
  };
}

export function rowToMission(row: Record<string, unknown>): MissionLog {
  return {
    id: asString(row.id),
    title: asString(row.title, "Untitled mission"),
    missionMode: (row.mission_mode || "standard") as MissionLog["missionMode"],
    crew: asArray<string>(row.crew),
    date: asString(row.date),
    rawTranscript: asString(row.raw_transcript),
    summary: asString(row.summary),
    engineeringNotebookEntry: asString(row.engineering_notebook_entry),
    commandDecisions: asArray(row.command_decisions),
    taskAssignments: asArray(row.task_assignments),
    systemAnomalies: asArray(row.system_anomalies),
    nextMissionGoals: asArray(row.next_mission_goals),
    proofChecklist: asArray(row.proof_checklist),
    judgeRecap: asString(row.judge_recap),
    missingDocumentationWarnings: asArray(row.missing_documentation_warnings),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
    projectName: asString(row.project_name, "Unassigned project"),
  };
}
