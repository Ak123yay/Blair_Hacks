import { MeetingType, MissionFormData, MissionLog } from "@/types/mission";

const BLOCKED_VALUES = new Set([
  "asdf",
  "dsa",
  "n/a",
  "na",
  "none",
  "null",
  "test",
  "testing",
  "unknown",
  "undefined",
]);

const VALID_MEETING_TYPES: MeetingType[] = ["software", "mechanical", "testing", "strategy", "competition"];

export interface QualityReport {
  score: number;
  missing: string[];
  readyForFinal: boolean;
}

export function validateMissionInput(data: Partial<MissionFormData>) {
  const errors: string[] = [];

  if (!isValidDate(data.date)) errors.push("Enter a real mission date.");
  if (!isRealText(data.projectName)) errors.push("Enter a real project name.");
  if (!isRealText(data.title)) errors.push("Enter a real mission title.");
  if (!isValidMeetingType(data.meetingType)) errors.push("Choose a meeting type.");

  const crew = splitCrew(data.crew || "");
  if (!crew.length) {
    errors.push("Enter at least one real team member.");
  } else if (crew.some((member) => !isRealText(member))) {
    errors.push("Remove placeholder team member names like dsa, test, unknown, or N/A.");
  }

  if (!isRealText(data.transcript, 20)) errors.push("Add real meeting notes with at least one engineering detail.");

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getMetadataQuality(mission: MissionLog) {
  const missing: string[] = [];

  if (!isValidDate(mission.date)) missing.push("Real date");
  if (!isRealText(mission.projectName)) missing.push("Project name");
  if (!isRealText(mission.title)) missing.push("Mission title");
  if (!mission.crew.length || mission.crew.some((member) => !isRealText(member))) missing.push("Real team member names");
  if (!isValidMeetingType(mission.meetingType)) missing.push("Meeting type");

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function isRealText(value: unknown, minLength = 3) {
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  if (normalized.length < minLength) return false;
  if (BLOCKED_VALUES.has(normalized)) return false;
  if (/^(.)\1+$/.test(normalized)) return false;
  return /[a-z0-9]/i.test(normalized);
}

export function isValidDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time);
}

export function isValidMeetingType(value: unknown): value is MeetingType {
  return typeof value === "string" && VALID_MEETING_TYPES.includes(value as MeetingType);
}

export function splitCrew(value: string) {
  return value.split(",").map((member) => member.trim()).filter(Boolean);
}
