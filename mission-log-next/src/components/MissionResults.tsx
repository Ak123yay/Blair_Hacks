"use client";

import { MissionLog } from "@/types/mission";
import { Ic } from "@/components/icons/Ic";

interface MissionResultsProps {
  mission: MissionLog;
  onSave: () => void;
  saved: boolean;
}

const modeBadgeColors: Record<string, string> = {
  standard: "var(--info-soft)",
  vex: "var(--warn-soft)",
  hackathon: "var(--cosmic-soft)",
};

const modeTextColors: Record<string, string> = {
  standard: "var(--info)",
  vex: "oklch(0.55 0.10 50)",
  hackathon: "var(--cosmic)",
};

const priorityColors: Record<string, string> = {
  CRITICAL: "oklch(0.55 0.15 25)",
  HIGH: "oklch(0.60 0.12 35)",
  MEDIUM: "oklch(0.70 0.10 80)",
  LOW: "var(--leaf)",
};

const severityColors: Record<string, string> = {
  CRITICAL: "oklch(0.55 0.15 25)",
  HIGH: "oklch(0.60 0.12 35)",
  MEDIUM: "oklch(0.70 0.10 80)",
  LOW: "var(--leaf)",
};

export default function MissionResults({ mission, onSave, saved }: MissionResultsProps) {
  return (
    <div className="fadein-up" style={{ maxWidth: 900 }}>
      {/* HEADER */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ic name="rocket" size={22} color="white" />
          </div>
          <div>
            <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, margin: 0, letterSpacing: "-0.02em" }}>
              {mission.title}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span
                className="badge"
                style={{
                  background: modeBadgeColors[mission.missionMode],
                  color: modeTextColors[mission.missionMode],
                }}
              >
                {mission.missionMode}
              </span>
              <span className="mono" style={{ fontSize: 10 }}>
                {new Date(mission.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={saved}
          className={saved ? "btn btn-soft" : "btn btn-accent"}
          style={{ minWidth: 160 }}
        >
          <Ic name={saved ? "check" : "download"} size={14} color={saved ? "var(--leaf)" : "white"} />
          {saved ? "Saved to Flight Log" : "Save to Flight Log"}
        </button>
      </div>

      {/* SUMMARY */}
      {mission.summary && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="mono" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="sparkle" size={12} color="var(--accent-ink)" />
            Mission Summary
          </div>
          <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{mission.summary}</p>
        </div>
      )}

      {/* JUDGE RECAP */}
      {mission.judgeRecap && (
        <div
          className="card"
          style={{ padding: 22, marginBottom: 16, background: "var(--accent-softer)", borderColor: "transparent" }}
        >
          <div className="mono" style={{ marginBottom: 10, color: "var(--accent-ink)", display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="star-fill" size={12} color="var(--accent-ink)" />
            Judge-Ready Recap
          </div>
          <p style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.6 }}>{mission.judgeRecap}</p>
        </div>
      )}

      {/* ENGINEERING NOTEBOOK */}
      {mission.engineeringNotebookEntry && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="mono" style={{ marginBottom: 12 }}>Flight Log Entry (Engineering Notebook)</div>
          <div
            style={{
              padding: 18,
              background: "var(--paper-2)",
              borderRadius: 3,
              fontSize: 13.5,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              fontFamily: "var(--ui)",
            }}
          >
            {mission.engineeringNotebookEntry}
          </div>
        </div>
      )}

      {/* COMMAND DECISIONS */}
      {mission.commandDecisions && mission.commandDecisions.length > 0 && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="mono" style={{ marginBottom: 12 }}>
            <Ic name="target" size={12} className="inline mr-1" />
            Command Decisions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mission.commandDecisions.map((d, i) => (
              <div
                key={i}
                className="card-soft"
                style={{ padding: 16, border: "1px solid var(--rule-2)" }}
              >
                <div className="serif" style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
                  {d.decision}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>
                  <span style={{ color: "var(--accent-ink)", fontWeight: 500 }}>Rationale:</span> {d.rationale}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--ink-4)" }}>
                  <span>
                    <span style={{ color: "var(--ink-3)" }}>By:</span> {d.madeBy}
                  </span>
                  <span>
                    <span style={{ color: "var(--ink-3)" }}>Impact:</span> {d.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TASK ASSIGNMENTS */}
      {mission.taskAssignments && mission.taskAssignments.length > 0 && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="mono" style={{ marginBottom: 12 }}>
            <Ic name="target" size={12} className="inline mr-1" />
            Objectives (Task Assignments)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mission.taskAssignments.map((t, i) => (
              <div
                key={i}
                className="card-soft"
                style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--accent-soft)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "var(--ink)" }}>{t.task}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--ink-4)" }}>
                    <span>
                      <span style={{ color: "var(--ink-3)" }}>Crew:</span> {t.assignee}
                    </span>
                    <span>
                      <span style={{ color: "var(--ink-3)" }}>Due:</span> {t.dueDate}
                    </span>
                    <span style={{ color: priorityColors[t.priority], fontWeight: 600 }}>{t.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM ANOMALIES */}
      {mission.systemAnomalies && mission.systemAnomalies.length > 0 && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="mono" style={{ marginBottom: 12, color: "oklch(0.55 0.15 25)", display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="alert-triangle" size={12} color="oklch(0.55 0.15 25)" />
            System Anomalies (Problems/Bugs)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mission.systemAnomalies.map((a, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  borderRadius: 4,
                  border: `1px solid ${severityColors[a.severity]}40`,
                  background: `${severityColors[a.severity]}10`,
                }}
              >
                <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 6 }}>{a.problem}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4 }}>
                  <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>Context:</span> {a.context}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
                  <span style={{ color: "var(--leaf)", fontWeight: 500 }}>Suggested Fix:</span> {a.suggestedFix}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span
                    className="badge"
                    style={{
                      background: severityColors[a.severity],
                      color: "white",
                      fontSize: 9,
                    }}
                  >
                    {a.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEXT MISSION GOALS */}
      {mission.nextMissionGoals && mission.nextMissionGoals.length > 0 && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="mono" style={{ marginBottom: 12 }}>
            <Ic name="arrow-r" size={12} className="inline mr-1" />
            Launch Checklist (Next Steps)
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none" }}>
            {mission.nextMissionGoals.map((g, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "8px 0",
                  fontSize: 14,
                  color: "var(--ink-2)",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1.5px solid var(--accent)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PROOF CHECKLIST */}
      {mission.proofChecklist && mission.proofChecklist.length > 0 && (
        <div className="card" style={{ padding: 22, marginBottom: 16, background: "oklch(0.96 0.03 145)", borderColor: "oklch(0.88 0.06 145)" }}>
          <div className="mono" style={{ marginBottom: 12, color: "var(--leaf)", display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="clipboard-check" size={12} color="var(--leaf)" />
            Proof Checklist
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none" }}>
            {mission.proofChecklist.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "6px 0",
                  fontSize: 13.5,
                  color: "var(--ink-2)",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    border: "1.5px solid var(--leaf)",
                    flexShrink: 0,
                    marginTop: 3,
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* MISSING DOCUMENTATION WARNINGS */}
      {mission.missingDocumentationWarnings && mission.missingDocumentationWarnings.length > 0 && (
        <div className="card" style={{ padding: 22, background: "var(--warn-soft)", borderColor: "oklch(0.90 0.06 80)" }}>
          <div className="mono" style={{ marginBottom: 12, color: "oklch(0.55 0.10 50)", display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="alert-triangle" size={12} color="oklch(0.55 0.10 50)" />
            Missing Documentation
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none" }}>
            {mission.missingDocumentationWarnings.map((w, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "6px 0",
                  fontSize: 13.5,
                  color: "oklch(0.45 0.10 75)",
                }}
              >
                <Ic name="alert-triangle" size={14} color="oklch(0.55 0.10 50)" className="mt-1 flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}