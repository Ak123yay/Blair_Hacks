"use client";

import { MissionLog } from "@/types/mission";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import { Ic } from "./icons/Ic";

interface TimelineViewProps {
  missions: MissionLog[];
}

export default function TimelineView({ missions }: TimelineViewProps) {
  const sorted = [...missions].sort((a, b) =>
    isAfter(parseISO(b.date), parseISO(a.date)) ? 1 : -1
  );

  const grouped: Record<string, MissionLog[]> = {};
  sorted.forEach((m) => {
    const day = format(startOfDay(parseISO(m.date)), "yyyy-MM-dd");
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(m);
  });

  const days = Object.keys(grouped).sort((a, b) => (isAfter(parseISO(b), parseISO(a)) ? 1 : -1));

  const modeColors: Record<string, string> = {
    standard: "var(--info)",
    vex: "oklch(0.55 0.10 50)",
    hackathon: "var(--cosmic)",
  };

  if (missions.length === 0) {
    return (
      <div className="card" style={{ padding: 60, textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--paper-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Ic name="clock" size={24} color="var(--ink-3)" />
        </div>
        <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>No missions logged yet</h3>
        <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 8 }}>Create your first mission to see the timeline.</p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* TIMELINE LINE */}
      <div
        style={{
          position: "absolute",
          left: "19px",
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--rule-2)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {days.map((day) => (
          <div key={day}>
            {/* DATE HEADER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, position: "relative" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "var(--paper)",
                  border: `2px solid var(--accent)`,
                  zIndex: 1,
                }}
              />
              <span className="mono" style={{ fontSize: 10.5 }}>
                {format(parseISO(day), "EEEE, MMMM d, yyyy")}
              </span>
            </div>

            {/* MISSIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 24 }}>
              {grouped[day].map((m) => {
                const time = format(parseISO(m.date), "h:mm a");
                return (
                  <div
                    key={m.id}
                    className="card hover-lift"
                    style={{
                      padding: 18,
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    {/* DOT */}
                    <div
                      style={{
                        position: "absolute",
                        left: -28,
                        top: 20,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: modeColors[m.missionMode] || "var(--ink-4)",
                        border: "2px solid var(--paper)",
                      }}
                    />

                    {/* CONTENT */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <h4 className="serif" style={{ fontSize: 17, fontWeight: 500, margin: 0 }}>
                            {m.title}
                          </h4>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--ink-4)" }}>
                            <span>{time}</span>
                            <span>·</span>
                            <span>{m.missionMode.toUpperCase()}</span>
                            {m.projectName && (
                              <>
                                <span>·</span>
                                <span>{m.projectName}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <a
                          href={`/mission/${m.id}`}
                          style={{ fontSize: 12, color: "var(--accent-ink)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}
                        >
                          View <Ic name="arrow-r" size={11} />
                        </a>
                      </div>

                      {m.summary && (
                        <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 10, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {m.summary}
                        </p>
                      )}

                      {/* NEXT STEPS PREVIEW */}
                      {m.nextMissionGoals && m.nextMissionGoals.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                          {m.nextMissionGoals.slice(0, 3).map((g, i) => (
                            <span
                              key={i}
                              className="chip"
                              style={{ fontSize: 10.5, padding: "4px 8px" }}
                            >
                              {g.length > 35 ? g.substring(0, 35) + "..." : g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}