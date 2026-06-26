import { NextRequest, NextResponse } from "next/server";
import { generateMissionLog } from "@/lib/glm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, crew, mode, title, customCategory } = body;

    if (!transcript || !transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Mission title is required" },
        { status: 400 }
      );
    }

    const mission = await generateMissionLog(
      transcript,
      crew || "",
      mode || "standard",
      title,
      customCategory
    );

    return NextResponse.json(mission);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate mission log";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
