"use client";

import { useState } from "react";
import { MissionFormData, MissionMode } from "@/types/mission";
import { Ic } from "@/components/icons/Ic";
import { StyleSection } from "./Shared";
import AudioUploader from "./AudioUploader";
import { validateMissionInput } from "@/lib/mission-quality";

interface MissionFormProps {
  onSubmit: (data: MissionFormData) => void;
  loading: boolean;
  initialTranscript?: string;
  onTranscriptChange?: (transcript: string) => void;
}

const modes: { value: MissionMode; label: string; icon: string; desc: string }[] = [
  { value: "standard", label: "Standard", icon: "clipboard-check", desc: "General engineering team" },
  { value: "vex", label: "VEX Robotics", icon: "cpu", desc: "VEX competition notebook" },
  { value: "hackathon", label: "Hackathon", icon: "code", desc: "Sprint build & demo prep" },
  { value: "startup", label: "Startup", icon: "rocket", desc: "Product & growth tracking" },
  { value: "research", label: "Research Lab", icon: "book", desc: "Experiments & publications" },
  { value: "freelance", label: "Freelance", icon: "user", desc: "Client work & deliverables" },
  { value: "enterprise", label: "Enterprise", icon: "database", desc: "Corporate engineering teams" },
  { value: "custom", label: "Custom", icon: "sparkle", desc: "Define your own category" },
];

const sampleRoboticsMission: MissionFormData = {
  title: "Drive Base Testing and Intake Reliability",
  teamName: "VEX Robotics 1234A",
  missionMode: "vex",
  meetingType: "testing",
  crew: "Aarush, Maya, Jordan, Sam",
  date: new Date().toISOString().slice(0, 10),
  projectName: "VEX High Stakes Robot",
  customCategory: "",
  transcript: `Today the team tested the new drivetrain and intake changes on the practice field.

The main goal was to decide whether to keep the H-drive prototype or switch back to a tank drive base before the next tournament. Maya ran five strafing tests with the H-drive and the robot drifted right by 8 to 12 inches on three of the runs. The center wheel also lost traction when the battery dropped below 70 percent. Jordan compared this with the tank drive setup from last week, which was less maneuverable but much more consistent during autonomous.

After reviewing the test results, the team decided to stop using H-drive and move back to tank drive for competition reliability. The reason was that consistent autonomous pathing matters more than sideways movement for our current scoring strategy. We need to document this with a photo of both drive bases and a table comparing strafing accuracy, turn accuracy, and autonomous success rate.

Sam updated the autonomous routine for the tank drive. The robot completed the first scoring path 4 out of 5 times, but the final turn was still about 3 degrees short. Aarush tuned the turn PID from 0.42 to 0.48 and reduced the error to about 1.5 degrees. We still need one full-field video showing the final autonomous run.

The intake worked better after adding a second rubber band, but the left roller slipped when the robot contacted the wall. Maya suggested replacing the rubber band tensioner with a small standoff spacer. Jordan will CAD the spacer tonight and bring a printed version to the next build session.

Tasks for next meeting: Sam will finish autonomous tuning, Maya will collect video evidence, Jordan will CAD and print the intake spacer, and Aarush will update the engineering notebook with the drivetrain decision and test data. The team also needs photos of the old H-drive, the new tank drive, and the intake roller issue.`,
};

export default function MissionForm({ onSubmit, loading, initialTranscript = "", onTranscriptChange }: MissionFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<MissionFormData>({
    title: "",
    teamName: "VEX Robotics 1234A",
    missionMode: "standard",
    meetingType: "software",
    crew: "",
    date: new Date().toISOString().slice(0, 10),
    transcript: initialTranscript,
    projectName: "",
    customCategory: "",
  });

  const loadSampleRoboticsMission = () => {
    setFormData(sampleRoboticsMission);
    onTranscriptChange?.(sampleRoboticsMission.transcript);
  };

  const handleTranscriptChange = (value: string) => {
    setFormData((f) => ({ ...f, transcript: value }));
    onTranscriptChange?.(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateMissionInput(formData);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);
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
          Paste your notes. AI generates a full notebook page, tasks, decisions, evidence gaps, and judge prep.
        </p>
        <button
          type="button"
          className="btn btn-soft"
          onClick={loadSampleRoboticsMission}
          style={{ marginTop: 18 }}
        >
          <Ic name="sparkle" size={14} />
          Load Sample Robotics Mission
        </button>
      </div>

      {/* MODE SELECTION */}
      <StyleSection label="Mission Mode" hint="Choose the documentation style">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
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

        {/* CUSTOM CATEGORY INPUT */}
        {formData.missionMode === "custom" && (
          <div style={{ marginTop: 16 }}>
            <label className="mono" style={{ display: "block", marginBottom: 6 }}>
              <Ic name="sparkle" size={11} className="inline mr-1" /> What&apos;s your team category?
            </label>
            <input
              type="text"
              required
              value={formData.customCategory}
              onChange={(e) => setFormData((f) => ({ ...f, customCategory: e.target.value }))}
              placeholder="e.g., Podcast Production, Film Crew, Medical Team, Construction, Event Planning..."
              className="input"
              style={{ borderColor: "var(--accent)", background: "var(--accent-softer)" }}
            />
<p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", marginRight: 4 }}>
            <Ic name="info" size={11} className="inline" />
          </span>
          AI will auto-generate a custom prompt for {formData.customCategory || "your category"} with industry-specific terminology and documentation standards.
        </p>
          </div>
        )}
      </StyleSection>

      {/* TITLE & PROJECT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 28 }}>
        <div>
          <label className="mono" style={{ display: "block", marginBottom: 6 }}>
            Date
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
            className="input"
          />
        </div>

        <div>
          <label className="mono" style={{ display: "block", marginBottom: 6 }}>
            Team
          </label>
          <input
            type="text"
            value={formData.teamName || ""}
            onChange={(e) => setFormData((f) => ({ ...f, teamName: e.target.value }))}
            placeholder="e.g., VEX Robotics 1234A"
            className="input"
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
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

        <div style={{ gridColumn: "1 / -1" }}>
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

      <div style={{ marginTop: 18 }}>
        <label className="mono" style={{ display: "block", marginBottom: 8 }}>
          Meeting Type
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
          {(["software", "mechanical", "testing", "strategy", "competition"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData((f) => ({ ...f, meetingType: type }))}
              className={formData.meetingType === type ? "chip chip-active chip-mono" : "chip chip-mono"}
              style={{ justifyContent: "center", textTransform: "capitalize" }}
            >
              {type}
            </button>
          ))}
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
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <label className="mono" style={{ display: "block" }}>
            <Ic name="file" size={11} className="inline mr-1" /> Mission Transcript / Notes
          </label>
          <span className="mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>
            Or upload audio/video
          </span>
        </div>
        
        {/* AUDIO UPLOADER */}
        {!formData.transcript && (
          <div style={{ marginBottom: 16 }}>
            <AudioUploader 
              onTranscriptReady={(transcript) => {
                handleTranscriptChange(transcript);
              }}
              onError={() => {}}
              disabled={loading}
            />
          </div>
        )}

        {formData.transcript && (
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              className="btn btn-soft btn-sm"
              onClick={() => handleTranscriptChange("")}
              style={{ fontSize: 11 }}
            >
              <Ic name="upload" size={12} />
              Upload Different Audio
            </button>
          </div>
        )}

        <textarea
          required={!initialTranscript}
          rows={12}
          value={formData.transcript}
          onChange={(e) => handleTranscriptChange(e.target.value)}
          placeholder={`Paste your meeting notes, transcript, or rough notes here...

Example:
"Today we worked on the autonomous path. Alex tuned the PID controller - we got the turn accuracy from 5 degrees off to about 2 degrees. The arm mechanism is still having issues with the rubber bands slipping. Jordan suggested switching to a ratchet mechanism instead. We decided to prototype the ratchet design by next meeting. Sam programmed the new intake sequence but we need to test it on the actual field..."`}
          className="input"
          style={{ resize: "vertical" }}
        />
      </div>

      {/* SUBMIT */}
      {validationErrors.length > 0 && (
        <div
          className="card"
          style={{
            marginTop: 22,
            padding: 16,
            borderColor: "oklch(0.85 0.08 25)",
            background: "oklch(0.97 0.02 25)",
          }}
        >
          <div className="mono" style={{ marginBottom: 8, color: "oklch(0.55 0.10 50)" }}>
            Fix metadata before generation
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--ink-3)", fontSize: 13.5, lineHeight: 1.6 }}>
            {validationErrors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
          <Ic name="sparkle" size={13} className="inline" color="var(--accent-ink)" />
          <span style={{ marginLeft: 6 }}>
            Powered by GLM 5.1 - about 30 seconds
            {formData.missionMode === "custom" && formData.customCategory && (
              <span style={{ marginLeft: 8, color: "var(--accent-ink)" }}>
                - Custom: {formData.customCategory}
              </span>
            )}
          </span>
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
