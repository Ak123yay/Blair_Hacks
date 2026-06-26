import { createClient } from "../supabase/server";

export type DashboardUser = {
  email: string;
  initial: string;
  name: string;
  isTrial: boolean;
  plan: string;
  trialDaysLeft: number;
  trialEndsAt: string | null;
};

export async function getDashboardUser(): Promise<DashboardUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, plan, trial_ends_at, is_trial")
      .eq("id", user.id)
      .single();

    const trialEndsAt = profile?.trial_ends_at || user.created_at;
    const trialDaysLeft = trialEndsAt
      ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
      : 0;

    return {
      email: user.email || "",
      initial: (user.email || "U")[0].toUpperCase(),
      name: profile?.full_name || user.email?.split("@")[0] || "User",
      isTrial: profile?.is_trial ?? true,
      plan: profile?.plan || "Pro",
      trialDaysLeft,
      trialEndsAt,
    };
  } catch {
    return null;
  }
}

export async function getDashboardUserOrRedirect(redirectTo: string = "/login"): Promise<DashboardUser> {
  const user = await getDashboardUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
}