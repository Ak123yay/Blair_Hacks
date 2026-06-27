import { NextRequest, NextResponse } from "next/server";
import { generateMissionLog } from "@/lib/glm";
import { validateMissionInput } from "@/lib/mission-quality";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, crew, missionMode, mode, title, customCategory, teamName, projectName, date, meetingType } = body;
    const selectedMode = missionMode || mode || "standard";

    const validation = validateMissionInput({ transcript, crew, missionMode: selectedMode, title, customCategory, teamName, projectName, date, meetingType });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(" ") },
        { status: 400 }
      );
    }

    const mission = await generateMissionLog(
      transcript,
      crew || "",
      selectedMode,
      title,
      customCategory,
      { teamName, projectName, date, meetingType }
    );

    return NextResponse.json(mission);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate mission log";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
