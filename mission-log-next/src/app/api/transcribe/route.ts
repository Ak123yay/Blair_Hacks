import { NextRequest, NextResponse } from "next/server";

// AssemblyAI Speech-to-Text API
// Free tier: 5 hours/month
// Sign up: https://www.assemblyai.com/app/
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_UPLOAD_URL = "https://api.assemblyai.com/v2/upload";
const ASSEMBLYAI_TRANSCRIPT_URL = "https://api.assemblyai.com/v2/transcript";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    if (!ASSEMBLYAI_API_KEY) {
      console.error("ASSEMBLYAI_API_KEY not configured");
      return NextResponse.json(
        { 
          error: "AssemblyAI API key not configured",
          hint: "Get a free key at https://www.assemblyai.com/app/"
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof File)) {
      console.error("No audio file provided");
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    console.log(`Processing file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`);

    // AssemblyAI supports files up to 2.2 GB for upload, 5 GB for URL
    const maxSize = 2.2 * 1024 * 1024 * 1024; // 2.2 GB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 2.2GB limit" },
        { status: 400 }
      );
    }

    // Step 1: Upload the audio file (raw binary, NOT multipart)
    console.log("Uploading to AssemblyAI...");
    
    const uploadResponse = await fetch(ASSEMBLYAI_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: audioFile,
    });

    console.log(`Upload response: ${uploadResponse.status}`);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Upload failed: ${uploadResponse.status} - ${errorText}` },
        { status: uploadResponse.status }
      );
    }

    const uploadResult = await uploadResponse.json();
    const uploadUrl = uploadResult.upload_url;
    console.log("Upload successful:", uploadUrl);

    // Step 2: Submit transcription request
    console.log("Submitting transcription job...");
    
    const transcriptResponse = await fetch(ASSEMBLYAI_TRANSCRIPT_URL, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: uploadUrl,
        speech_models: ["universal-3-pro", "universal-2"], // Fallback list
        speaker_labels: true,
        punctuate: true,
        format_text: true,
      }),
    });

    if (!transcriptResponse.ok) {
      const errorText = await transcriptResponse.text();
      console.error(`Submit failed: ${transcriptResponse.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Failed to start transcription: ${transcriptResponse.status} - ${errorText}` },
        { status: transcriptResponse.status }
      );
    }

    const transcriptJob = await transcriptResponse.json();
    const transcriptId = transcriptJob.id;
    console.log("Transcript job submitted:", transcriptId);

    // Step 3: Poll for completion
    console.log("Polling for transcription completion...");
    
    let transcriptResult;
    let attempts = 0;
    const maxAttempts = 120; // 60 seconds max (polling every 500ms)
    
    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const statusResponse = await fetch(`${ASSEMBLYAI_TRANSCRIPT_URL}/${transcriptId}`, {
        headers: {
          Authorization: ASSEMBLYAI_API_KEY,
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      transcriptResult = await statusResponse.json();
      
      if (transcriptResult.status === "completed") {
        console.log("Transcription completed!");
        break;
      } else if (transcriptResult.status === "error") {
        throw new Error(transcriptResult.error || "Transcription failed");
      }
      
      attempts++;
      if (attempts % 10 === 0) {
        console.log(`Polling... attempt ${attempts}/${maxAttempts}, status: ${transcriptResult.status}`);
      }
    }

    if (transcriptResult.status !== "completed") {
      throw new Error("Transcription timed out");
    }

    const transcript = transcriptResult.text || "";
    
    if (!transcript) {
      throw new Error("No transcript text returned");
    }

    console.log(`Transcription successful: ${transcript.length} characters`);

    return NextResponse.json({
      transcript,
      language: transcriptResult.language_code || "en",
      confidence: transcriptResult.confidence,
      speaker_labels: transcriptResult.speaker_labels,
    });
  } catch (error: unknown) {
    console.error("Transcription error:", error);
    const message = error instanceof Error ? error.message : "Failed to transcribe audio";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}