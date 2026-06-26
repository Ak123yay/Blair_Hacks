"use client";

import { useState } from "react";
import { MissionFormData, MissionMode } from "@/types/mission";
import { Ic } from "@/components/icons/Ic";
import { StyleSection } from "./Shared";

interface MissionFormProps {
  onSubmit: (data: MissionFormData) => void;
  loading: boolean;
}

const modes: { value: MissionMode; label: string; icon: string; desc: string }[] = [
  { value: "standard", label: "Standard", icon: "clipboard-check", desc: "General engineering team" },
  { value: "vex", label: "VEX Robotics", icon: "cpu", desc: "VEX competition notebook" },
  { value: "hackathon", label: "Hackathon", icon: "code", desc: "Sprint build & demo prep" },
];

export default function MissionForm({ onSubmit, loading }: MissionFormProps) {
  const [formData, setFormData] = useState<MissionFormData>({
    title: "",
    missionMode: "standard",
    crew: "",
    transcript: "",
    projectName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="fadein-up">
      {/* STEP INDICATOR */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Create Mission Log</div>
        <h1 className="serif" style={{ fontSize: 48, lineHeight: 1.05, margin: 0, fontWeight: 400 }}>
          Document your <span className="serif-italic">team meeting</span>
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 14 }}>
          Paste your notes. AI generates engineering logs, tasks, and judge-ready summaries.
        </p>
      </div>

      {/* MODE SELECTION */}
      <StyleSection label="Mission Mode" hint="Choose the documentation style">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {modes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setFormData((f) => ({ ...f, missionMode: mode.value }))}
              style={{
                padding: "14px 12px",
                border: `1.5px solid ${formData.missionMode === mode.value ? "var(--ink)" : "var(--rule)"}`,
                borderRadius: 4,
                background: formData.missionMode === mode.value ? "var(--ink)" : "var(--paper)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.14s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: formData.missionMode === mode.value ? "var(--accent-soft)" : "var(--paper-2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic
                    name={mode.icon}
                    size={16}
                    color={formData.missionMode === mode.value ? "var(--accent-ink)" : "var(--ink-3)"}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: formData.missionMode === mode.value ? "var(--paper)" : "var(--ink)",
                  }}
                >
                  {mode.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: formData.missionMode === mode.value ? "rgba(255,255,255,0.55)" : "var(--ink-4)",
                  lineHeight: 1.4,
                }}
              >
                {mode.desc}
              </div>
            </button>
          ))}
        </div>
      </StyleSection>

      {/* TITLE & PROJECT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 28 }}>
        <div>
          <label className="mono" style={{ display: "block", marginBottom: 6 }}>
            Mission Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g., Build Session #12"
            className="input"
          />
        </div>

        <div>
          <label className="mono" style={{ display: "block", marginBottom: 6 }}>
            Project Name
          </label>
          <input
            type="text"
            value={formData.projectName}
            onChange={(e) => setFormData((f) => ({ ...f, projectName: e.target.value }))}
            placeholder="e.g., VEX Over Under"
            className="input"
          />
        </div>
      </div>

      {/* CREW */}
      <div style={{ marginTop: 18 }}>
        <label className="mono" style={{ display: "block", marginBottom: 6 }}>
          <Ic name="users" size={11} className="inline mr-1" /> Crew Members (comma separated)
        </label>
        <input
          type="text"
          value={formData.crew}
          onChange={(e) => setFormData((f) => ({ ...f, crew: e.target.value }))}
          placeholder="e.g., Alex, Jordan, Sam"
          className="input"
        />
      </div>

      {/* TRANSCRIPT */}
      <div style={{ marginTop: 18 }}>
        <label className="mono" style={{ display: "block", marginBottom: 6 }}>
          <Ic name="file" size={11} className="inline mr-1" /> Mission Transcript / Notes
        </label>
        <textarea
          required
          rows={10}
          value={formData.transcript}
          onChange={(e) => setFormData((f) => ({ ...f, transcript: e.target.value }))}
          placeholder={`Paste your meeting notes, transcript, or rough notes here...

Example:
"Today we worked on the autonomous path. Alex tuned the PID controller - we got the turn accuracy from 5 degrees off to about 2 degrees. The arm mechanism is still having issues with the rubber bands slipping. Jordan suggested switching to a ratchet mechanism instead. We decided to prototype the ratchet design by next meeting. Sam programmed the new intake sequence but we need to test it on the actual field..."`}
          className="input"
          style={{ resize: "vertical" }}
        />
      </div>

      {/* SUBMIT */}
      <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
          <Ic name="sparkle" size={13} className="inline" color="var(--accent-ink)" />
          <span style={{ marginLeft: 6 }}>Powered by GLM 5.1 · ~30 seconds</span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-accent btn-lg"
          style={{ minWidth: 200 }}
        >
          {loading ? (
            <>
              <Ic name="refresh" size={15} color="white" className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Ic name="sparkle" size={15} color="white" />
              Generate Mission Log
            </>
          )}
        </button>
      </div>
    </form>
  );
}