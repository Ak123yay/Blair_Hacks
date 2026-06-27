import { MissionLog } from "@/types/mission";
import { supabase } from "./supabase";

const LOCAL_STORAGE_KEY = "missionlog_missions";

export async function getMissions(): Promise<MissionLog[]> {
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
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
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("missions")
        .upsert({
          ...mission,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        });

      if (!error) return;
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
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("missions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) return;
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