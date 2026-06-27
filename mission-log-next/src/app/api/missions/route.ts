import { NextRequest, NextResponse } from "next/server";
import { missionToRow, rowToMission } from "@/lib/mission-db";
import { createClient } from "@/lib/supabase/server";
import { MissionLog } from "@/types/mission";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(((data || []) as Record<string, unknown>[]).map((row) => rowToMission(row)));
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mission: MissionLog = await request.json();
  
  const { data, error } = await supabase
    .from("missions")
    .upsert(missionToRow(mission, user.id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(rowToMission(data as Record<string, unknown>));
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  
  const { error } = await supabase
    .from("missions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
