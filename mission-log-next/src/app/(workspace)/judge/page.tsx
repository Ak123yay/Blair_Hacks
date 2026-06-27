"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Ic } from "@/components/icons/Ic";
import { getJudgeBrief, getJudgeReadinessScore } from "@/lib/mission-derived";
import { getMissions } from "@/lib/storage";
import { MissionLog } from "@/types/mission";

export default function JudgeModePage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  const sorted = [...missions].sort((a, b) => getJudgeReadinessScore(b) - getJudgeReadinessScore(a));
  const average = missions.length
    ? Math.round(missions.reduce((sum, mission) => sum + getJudgeReadinessScore(mission), 0) / missions.length)
    : 0;

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Judge Mode</div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>
          Competition-ready <span className="serif-italic">briefs</span>
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 12, maxWidth: 660, lineHeight: 1.65 }}>
          Generate what judges actually ask for: challenge, design iterations,
          testing evidence, member contributions, teamwork, and likely questions.
        </p>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 22, background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
        <p className="mono" style={{ color: "var(--accent-soft)", margin: 0 }}>Average Launch Readiness</p>
        <h2 className="serif" style={{ fontSize: 46, fontWeight: 500, margin: "8px 0 10px" }}>{average}%</h2>
        <div className="agent-progress-bar" style={{ height: 8, background: "rgb(255 255 255 / 0.14)" }}>
          <div className="agent-progress-bar-fill" style={{ width: `${average}%` }} />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card" style={{ padding: 56, textAlign: "center" }}>
          <Ic name="star" size={30} color="var(--ink-3)" />
          <h2 className="serif" style={{ margin: "14px 0 0", fontSize: 26, fontWeight: 500 }}>No judge briefs yet</h2>
          <p style={{ color: "var(--ink-3)", fontSize: 13.5 }}>Create a mission to generate the first judge-ready recap.</p>
          <Link href="/new" className="btn btn-accent" style={{ marginTop: 18 }}>Create Mission</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {sorted.map((mission) => {
            const brief = getJudgeBrief(mission);
            const score = getJudgeReadinessScore(mission);
            return (
              <Link className="card hover-lift" href={`/mission/${mission.id}`} key={mission.id} style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                  <div>
                    <p className="mono" style={{ margin: "0 0 8px" }}>{mission.projectName || "Unassigned project"}</p>
                    <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, margin: 0 }}>{mission.title}</h2>
                  </div>
                  <span className="badge badge-accent">{score}% Ready</span>
                </div>
                <p style={{ color: "var(--ink-3)", fontSize: 14, lineHeight: 1.6, margin: "14px 0 0" }}>
                  {brief.engineeringChallenge}
                </p>
                <div className="evidence-grid" style={{ marginTop: 16 }}>
                  {[
                    ["Iterations", brief.designIterations.length],
                    ["Evidence", brief.testingEvidence.length],
                    ["Questions", brief.likelyQuestions.length],
                  ].map(([label, value]) => (
                    <div className="card-soft" style={{ padding: 12 }} key={label as string}>
                      <span className="mono">{label as string}</span>
                      <strong className="serif" style={{ display: "block", fontSize: 24, marginTop: 4 }}>{value}</strong>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
