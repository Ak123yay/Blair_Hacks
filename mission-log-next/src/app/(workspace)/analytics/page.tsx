"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/icons/Ic";
import { MissionLog } from "@/types/mission";
import { getMissions } from "@/lib/storage";

export default function AnalyticsPage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  const totalTasks = missions.reduce((sum, m) => sum + (m.taskAssignments?.length || 0), 0);
  const totalAnomalies = missions.reduce((sum, m) => sum + (m.systemAnomalies?.length || 0), 0);

  const modeDistribution = missions.reduce<Record<string, number>>((acc, m) => {
    acc[m.missionMode] = (acc[m.missionMode] || 0) + 1;
    return acc;
  }, {});

  const modeLabels: Record<string, string> = {
    standard: "Standard",
    vex: "VEX Robotics",
    hackathon: "Hackathon",
    startup: "Startup",
    research: "Research Lab",
    freelance: "Freelance",
    enterprise: "Enterprise",
    custom: "Custom",
  };

  const modeColors: Record<string, string> = {
    standard: "var(--info)",
    vex: "oklch(0.55 0.10 50)",
    hackathon: "var(--cosmic)",
    startup: "var(--accent)",
    research: "oklch(0.55 0.14 260)",
    freelance: "var(--leaf)",
    enterprise: "oklch(0.45 0.10 50)",
    custom: "oklch(0.55 0.16 300)",
  };

  const recentMissions = [...missions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const weeklyData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const weekMissions = missions.filter((m) => new Date(m.createdAt) >= weekAgo);
    const byDay: Record<string, number> = {};
    days.forEach((d) => (byDay[d] = 0));
    weekMissions.forEach((m) => {
      const day = days[new Date(m.createdAt).getDay()];
      byDay[day]++;
    });
    return days.map((day) => ({ day, count: byDay[day] }));
  })();

  const maxWeekly = Math.max(...weeklyData.map((d) => d.count), 1);

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Analytics</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Mission <span className="serif-italic">Insights</span>
        </h1>
      </div>

      {missions.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Ic name="chart" size={24} color="var(--ink-3)" />
          </div>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>No data yet</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 8 }}>
            Create some missions to see your analytics.
          </p>
          <a href="/new" className="btn btn-accent" style={{ marginTop: 20 }}>
            <Ic name="plus" size={14} /> Create Mission
          </a>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total Missions", value: missions.length, icon: "rocket" },
              { label: "Total Tasks", value: totalTasks, icon: "target" },
              { label: "Anomalies Found", value: totalAnomalies, icon: "alert-triangle" },
              { label: "Projects", value: new Set(missions.map((m) => m.projectName).filter(Boolean)).size, icon: "folder" },
            ].map((stat) => (
              <div key={stat.label} className="card hover-lift" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic name={stat.icon} size={18} color="var(--accent-ink)" />
                  </div>
                </div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 500 }}>{stat.value}</div>
                <div className="mono" style={{ fontSize: 10, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 32 }}>
            <div className="card" style={{ padding: 24 }}>
              <div className="mono" style={{ marginBottom: 20 }}>This Week</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
                {weeklyData.map((d) => (
                  <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: "100%", height: `${Math.max((d.count / maxWeekly) * 100, 4)}%`, background: d.count > 0 ? "var(--accent)" : "var(--paper-3)", borderRadius: "4px 4px 0 0", minHeight: 4, transition: "height 0.3s" }} />
                    <span className="mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div className="mono" style={{ marginBottom: 20 }}>Mission Types</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(modeDistribution).map(([mode, count]) => (
                  <div key={mode}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{modeLabels[mode] || mode}</span>
                      <span className="mono" style={{ fontSize: 11 }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: "var(--paper-2)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(count / missions.length) * 100}%`, background: modeColors[mode] || "var(--accent)", borderRadius: 3, transition: "width 0.3s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div className="mono">Recent Missions</div>
              <a href="/dashboard" style={{ fontSize: 12, color: "var(--accent-ink)", display: "flex", alignItems: "center", gap: 4 }}>
                View All <Ic name="arrow-r" size={11} />
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentMissions.map((m) => (
                <a key={m.id} href={`/mission/${m.id}`} style={{ display: "flex", alignItems: "center", padding: 14, background: "var(--paper-2)", borderRadius: 6, textDecoration: "none", color: "inherit", transition: "background 0.12s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                    <Ic name="rocket" size={16} color="var(--accent-ink)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{m.title}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{new Date(m.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="badge" style={{ background: modeColors[m.missionMode] || "var(--accent)", color: "white", marginRight: 16 }}>
                    {modeLabels[m.missionMode] || m.missionMode}
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--ink-3)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Ic name="target" size={12} />
                      {m.taskAssignments?.length || 0}
                    </span>
                    {(m.systemAnomalies?.length || 0) > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Ic name="alert-triangle" size={12} />
                        {m.systemAnomalies.length}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
