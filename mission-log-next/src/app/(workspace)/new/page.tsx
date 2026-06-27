"use client";

import { useState } from "react";
import MissionForm from "@/components/MissionForm";
import MissionResults from "@/components/MissionResults";
import { MissionLog, MissionFormData } from "@/types/mission";
import { saveMission } from "@/lib/storage";
import { Ic } from "@/components/icons/Ic";


export default function NewMissionPage() {
  const [result, setResult] = useState<MissionLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [transcriptFromAudio, setTranscriptFromAudio] = useState<string>("");

  const handleSubmit = async (data: MissionFormData) => {
    setLoading(true);
    setError(null);
    setSaveError(null);
    setResult(null);
    setSaved(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Generation failed");
      }

      const mission: MissionLog = { ...json, projectName: data.projectName };
      setResult(mission);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    setSaveError(null);

    try {
      await saveMission(result);
      setSaved(true);
    } catch (err: unknown) {
      setSaved(false);
      setSaveError(err instanceof Error ? err.message : "Mission save failed");
    }
  };

  return (
    <>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {!result && !loading && (
          <div className="card" style={{ padding: "40px 48px" }}>
            <MissionForm 
              onSubmit={handleSubmit} 
              loading={loading}
              initialTranscript={transcriptFromAudio}
              onTranscriptChange={setTranscriptFromAudio}
            />
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 20px" }} className="fadein-up">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Ic name="sparkle" size={28} color="var(--accent-ink)" />
            </div>
            <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, margin: 0 }}>
              Building your mission log
            </h2>
            <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 12, maxWidth: 420, margin: "12px auto 0" }}>
              Our AI is analyzing your transcript and generating engineering documentation, task assignments, and judge-ready summaries.
            </p>
            <div className="agent-progress-bar" style={{ maxWidth: 400, margin: "32px auto 0", height: 3 }}>
              <div className="agent-progress-bar-fill" style={{ width: "60%", animation: "shimmer 1.5s ease-in-out infinite" }} />
            </div>
            <div className="mono" style={{ marginTop: 16, fontSize: 10 }}>
              ~20 seconds remaining
            </div>
          </div>
        )}

        {error && (
          <div
            className="card fadein-up"
            style={{ padding: 32, maxWidth: 500, margin: "0 auto", textAlign: "center", borderColor: "oklch(0.85 0.08 25)", background: "oklch(0.97 0.02 25)" }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "oklch(0.90 0.06 80)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Ic name="alert-triangle" size={22} color="oklch(0.55 0.10 50)" />
            </div>
            <h3 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>Mission Failed</h3>
            <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 8 }}>{error}</p>
            <button
              className="btn btn-soft"
              style={{ marginTop: 20 }}
              onClick={() => {
                setError(null);
                setResult(null);
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {result && !loading && (
          <>
            {saveError && (
              <div
                className="card fadein-up"
                style={{
                  padding: 18,
                  margin: "0 0 18px",
                  borderColor: "oklch(0.85 0.08 25)",
                  background: "oklch(0.97 0.02 25)",
                }}
              >
                <div className="mono" style={{ marginBottom: 6, color: "oklch(0.55 0.10 50)" }}>
                  Save failed
                </div>
                <p style={{ margin: 0, color: "var(--ink-3)", fontSize: 13.5 }}>
                  {saveError}
                </p>
              </div>
            )}
            <MissionResults mission={result} onSave={handleSave} saved={saved} />
          </>
        )}
      </div>
    </>
  );
}
