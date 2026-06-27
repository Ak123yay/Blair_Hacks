"use client";

import { useState } from "react";
import { MissionLog } from "@/types/mission";
import { Ic } from "@/components/icons/Ic";
import {
  getDesignMemory,
  getEvidenceVault,
  getJudgeBrief,
  getJudgeReadinessScore,
  getNotebookHtml,
  getNotebookPage,
} from "@/lib/mission-derived";

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
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const notebookPage = getNotebookPage(mission);
  const judgeBrief = getJudgeBrief(mission);
  const evidenceVault = getEvidenceVault(mission);
  const designMemory = getDesignMemory(mission);
  const judgeReadiness = getJudgeReadinessScore(mission);

  const downloadNotebookHtml = () => {
    const blob = new Blob([getNotebookHtml(mission)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${mission.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-notebook.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportNotebookPdf = () => {
    setExportMessage(null);

    const notebookWindow = window.open("", "_blank");
    if (!notebookWindow) {
      downloadNotebookHtml();
      setExportMessage("Popup blocked. Downloaded the notebook HTML instead; open it and print to PDF.");
      return;
    }

    notebookWindow.document.open();
    notebookWindow.document.write(getNotebookHtml(mission));
    notebookWindow.document.close();
    notebookWindow.focus();

    setExportMessage("Print dialog opened. Choose Save as PDF.");
    notebookWindow.setTimeout(() => {
      notebookWindow.print();
    }, 300);
  };

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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            onClick={exportNotebookPdf}
            className="btn btn-soft"
            style={{ minWidth: 160 }}
            type="button"
          >
            <Ic name="download" size={14} />
            Export PDF
          </button>
          <button
            onClick={onSave}
            disabled={saved}
            className={saved ? "btn btn-soft" : "btn btn-accent"}
            style={{ minWidth: 160 }}
            type="button"
          >
            <Ic name={saved ? "check" : "download"} size={14} color={saved ? "var(--leaf)" : "white"} />
            {saved ? "Saved to Flight Log" : "Save to Flight Log"}
          </button>
          {exportMessage && (
            <p className="mono" style={{ width: "100%", fontSize: 9, color: "var(--ink-3)", margin: 0 }}>
              {exportMessage}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Judge readiness", value: `${judgeReadiness}%`, icon: "star" },
          { label: "Evidence items", value: evidenceVault.length, icon: "image" },
          { label: "Decisions", value: mission.commandDecisions.length, icon: "target" },
          { label: "Objectives", value: mission.taskAssignments.length, icon: "clipboard-check" },
        ].map((stat) => (
          <div key={stat.label} className="card-soft" style={{ padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Ic name={stat.icon} size={14} color="var(--accent-ink)" />
              <span className="mono" style={{ fontSize: 9 }}>{stat.label}</span>
            </div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 500, marginTop: 8 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* FULL NOTEBOOK PAGE */}
      <div className="card mission-notebook-page" style={{ padding: 28, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div className="mono" style={{ marginBottom: 8 }}>Engineering Notebook Page</div>
            <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, margin: 0 }}>
              {notebookPage.missionTitle}
            </h3>
            <p className="mono" style={{ marginTop: 8 }}>
              {notebookPage.project} - {new Date(notebookPage.date).toLocaleDateString()}
            </p>
          </div>
          <span className="badge badge-accent">Full page</span>
        </div>

        <div className="notebook-section-grid">
          <section>
            <h4>Team Members Present</h4>
            <p>{notebookPage.teamMembers.join(", ")}</p>
          </section>
          <section>
            <h4>Goal</h4>
            <p>{notebookPage.goal}</p>
          </section>
          <section>
            <h4>Work Completed</h4>
            <p>{notebookPage.workCompleted}</p>
          </section>
          <section>
            <h4>Testing Performed</h4>
            <p>{notebookPage.testingPerformed}</p>
          </section>
          <section>
            <h4>Results</h4>
            <p>{notebookPage.results}</p>
          </section>
          <section>
            <h4>Problems Encountered</h4>
            <ul>
              {(notebookPage.problemsEncountered.length ? notebookPage.problemsEncountered : ["No problems documented."]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div style={{ marginTop: 18 }}>
          <h4 className="notebook-table-heading">Design Decisions</h4>
          <div className="notebook-table">
            <div className="notebook-table-row notebook-table-head">
              <span>Decision</span>
              <span>Reason</span>
              <span>Evidence Needed</span>
            </div>
            {(notebookPage.designDecisions.length
              ? notebookPage.designDecisions
              : [{ decision: "No design decision documented", reason: "Meeting notes need more detail.", evidenceNeeded: "Decision rationale" }]
            ).map((decision) => (
              <div className="notebook-table-row" key={`${decision.decision}-${decision.reason}`}>
                <span>{decision.decision}</span>
                <span>{decision.reason}</span>
                <span>{decision.evidenceNeeded}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="notebook-section-grid" style={{ marginTop: 18 }}>
          <section>
            <h4>Next Steps</h4>
            <ul>{notebookPage.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h4>Evidence Needed</h4>
            <ul>{notebookPage.evidenceNeeded.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
      </div>

      {/* JUDGE MODE */}
      <div className="card" style={{ padding: 24, marginBottom: 16, background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
        <div className="mono" style={{ marginBottom: 12, color: "var(--accent-soft)" }}>Judge Mode Brief</div>
        <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: "0 0 12px" }}>
          {judgeBrief.engineeringChallenge}
        </h3>
        <div className="judge-brief-grid">
          {[
            ["Design Iterations", judgeBrief.designIterations],
            ["Testing Evidence", judgeBrief.testingEvidence],
            ["Software Contributions", judgeBrief.softwareContributions],
            ["Mechanical Contributions", judgeBrief.mechanicalContributions],
            ["Likely Judge Questions", judgeBrief.likelyQuestions],
          ].map(([label, items]) => (
            <section key={label as string}>
              <h4>{label as string}</h4>
              <ul>
                {(items as string[]).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
        <p style={{ margin: "16px 0 0", color: "rgb(255 255 255 / 0.72)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--paper)" }}>Teamwork:</strong> {judgeBrief.teamwork}
        </p>
      </div>

      {/* EVIDENCE VAULT */}
      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="mono" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Ic name="image" size={12} color="var(--accent-ink)" />
          Evidence Vault
        </div>
        <div className="evidence-grid">
          {evidenceVault.length ? evidenceVault.map((item) => (
            <div key={`${item.type}-${item.description}`} className="card-soft evidence-item">
              <span className="badge badge-warn">{item.status}</span>
              <h4>{item.type}</h4>
              <p>{item.description}</p>
              <small>{item.relatedTo} - {item.usefulFor}</small>
            </div>
          )) : (
            <p style={{ color: "var(--ink-3)", margin: 0 }}>No evidence gaps were detected.</p>
          )}
        </div>
      </div>

      {/* DESIGN MEMORY */}
      {designMemory.length > 0 && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="mono" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="database" size={12} color="var(--accent-ink)" />
            Design Memory
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {designMemory.map((memory) => (
              <div key={memory.question} className="card-soft" style={{ padding: 16 }}>
                <h4 style={{ margin: 0, fontSize: 14 }}>{memory.question}</h4>
                <p style={{ margin: "8px 0 0", color: "var(--ink-3)", fontSize: 13.5, lineHeight: 1.55 }}>
                  {memory.answer}
                </p>
                <p className="mono" style={{ marginTop: 8, fontSize: 9 }}>
                  Cites: {memory.citations.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

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
