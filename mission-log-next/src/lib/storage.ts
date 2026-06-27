import { MissionLog } from "@/types/mission";
import { missionToRow, rowToMission } from "./mission-db";
import { createClient } from "./supabase/client";

const LOCAL_STORAGE_KEY = "missionlog_missions";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("https://") &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function getSupabaseClient() {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return null;
  return createClient();
}

export async function getMissions(): Promise<MissionLog[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return (data as Record<string, unknown>[]).map((row) => rowToMission(row));
      }

      if (error) {
        console.error("Failed to load missions from Supabase:", error.message);
      }
    }
  }

  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getMission(id: string): Promise<MissionLog | undefined> {
  const missions = await getMissions();
  return missions.find((m) => m.id === id);
}

export async function saveMission(mission: MissionLog): Promise<void> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("missions")
        .upsert(missionToRow(mission, user.id));

      if (error) {
        throw new Error(`Mission save failed: ${error.message}`);
      }

      return;
    }
  }

  const missions = getMissionsLocal();
  const idx = missions.findIndex((m) => m.id === mission.id);
  if (idx >= 0) {
    missions[idx] = mission;
  } else {
    missions.unshift(mission);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(missions));
}

export async function deleteMission(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("missions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw new Error(`Mission delete failed: ${error.message}`);
      }

      return;
    }
  }

  const missions = getMissionsLocal().filter((m) => m.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(missions));
}

export function getMissionsLocal(): MissionLog[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getMissionsByProject(projectName: string): Promise<MissionLog[]> {
  const missions = await getMissions();
  return missions.filter(
    (m) => m.projectName.toLowerCase() === projectName.toLowerCase()
  );
}

export function getUniqueProjectsLocal(): string[] {
  const missions = getMissionsLocal();
  const projects = new Set(missions.map((m) => m.projectName));
  return Array.from(projects).filter(Boolean);
}

export async function getUniqueProjects(): Promise<string[]> {
  const missions = await getMissions();
  const projects = new Set(missions.map((m) => m.projectName));
  return Array.from(projects).filter(Boolean);
}
