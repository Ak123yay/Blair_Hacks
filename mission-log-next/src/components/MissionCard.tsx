"use client";

import { Ic } from "@/components/icons/Ic";
import { MissionLog } from "@/types/mission";

interface MissionCardProps {
  mission: MissionLog;
  onDelete: (id: string) => void;
}

const modeIcons: Record<string, string> = {
  standard: "clipboard-check",
  vex: "cpu",
  hackathon: "code",
};

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

export default function MissionCard({ mission, onDelete }: MissionCardProps) {
  const ModeIcon = modeIcons[mission.missionMode] || "sites";
  const dateStr = new Date(mission.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="card hover-lift"
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            background: "var(--accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Ic name={ModeIcon} size={18} color="var(--accent-ink)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <h3 className="serif" style={{ fontSize: 17, fontWeight: 500, margin: 0, letterSpacing: "-0.01em" }}>
              {mission.title}
            </h3>
            <button
              onClick={() => onDelete(mission.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--ink-4)" }}
              className="hover-lift"
            >
              <Ic name="trash" size={14} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span className="mono" style={{ fontSize: 9.5 }}>{dateStr}</span>
            {mission.projectName && (
              <>
                <span style={{ color: "var(--ink-4)" }}>·</span>
                <span className="mono" style={{ fontSize: 9.5 }}>{mission.projectName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {mission.summary && (
        <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {mission.summary}
        </p>
      )}

      {/* STATS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--ink-4)" }}>
        {mission.taskAssignments?.length > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
            {mission.taskAssignments.length} objectives
          </span>
        )}
        {mission.systemAnomalies?.length > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(0.55 0.15 25)" }} />
            {mission.systemAnomalies.length} anomalies
          </span>
        )}
        {mission.commandDecisions?.length > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cosmic)" }} />
            {mission.commandDecisions.length} decisions
          </span>
        )}
      </div>

      {/* BADGE */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--rule-2)" }}>
        <span
          className="badge"
          style={{
            background: modeBadgeColors[mission.missionMode],
            color: modeTextColors[mission.missionMode],
            fontSize: 9,
          }}
        >
          {mission.missionMode}
        </span>
        <a
          href={`/mission/${mission.id}`}
          style={{ fontSize: 12, color: "var(--accent-ink)", display: "flex", alignItems: "center", gap: 4 }}
        >
          View <Ic name="arrow-r" size={11} />
        </a>
      </div>
    </div>
  );
}