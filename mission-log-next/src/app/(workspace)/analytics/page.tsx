"use client";

import { Ic } from "@/components/icons/Ic";

const stats = [
  { label: "Total Missions", value: "24", change: "+12%", trend: "up", icon: "rocket" },
  { label: "Tasks Completed", value: "156", change: "+23%", trend: "up", icon: "check" },
  { label: "Avg. Response Time", value: "2.4s", change: "-8%", trend: "down", icon: "clock" },
  { label: "Team Members", value: "8", change: "+2", trend: "up", icon: "users" },
];

const activityData = [
  { day: "Mon", missions: 3, tasks: 12 },
  { day: "Tue", missions: 5, tasks: 18 },
  { day: "Wed", missions: 2, tasks: 8 },
  { day: "Thu", missions: 6, tasks: 22 },
  { day: "Fri", missions: 4, tasks: 15 },
  { day: "Sat", missions: 1, tasks: 4 },
  { day: "Sun", missions: 3, tasks: 10 },
];

const recentMissions = [
  { title: "Autonomous Path Tuning", date: "2 hours ago", mode: "vex", tasks: 4, anomalies: 1 },
  { title: "Drive Team Practice", date: "1 day ago", mode: "vex", tasks: 3, anomalies: 0 },
  { title: "Sensor Integration", date: "2 days ago", mode: "hackathon", tasks: 6, anomalies: 2 },
  { title: "Pit Setup Planning", date: "3 days ago", mode: "vex", tasks: 5, anomalies: 0 },
];

const modeColors: Record<string, string> = {
  vex: "oklch(0.55 0.10 50)",
  hackathon: "var(--cosmic)",
  standard: "var(--info)",
};

export default function AnalyticsPage() {
  const maxTasks = Math.max(...activityData.map((d) => d.tasks));

  return (
    <div className="fadein-up" style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Analytics</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Mission <span className="serif-italic">Insights</span>
        </h1>
      </div>

      {/* STATS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card hover-lift" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic name={stat.icon} size={18} color="var(--accent-ink)" />
              </div>
              <span
                className="badge"
                style={{
                  background: stat.trend === "up" ? "oklch(0.92 0.04 145)" : "var(--accent-soft)",
                  color: stat.trend === "up" ? "var(--leaf)" : "var(--accent-ink)",
                }}
              >
                {stat.change}
              </span>
            </div>
            <div className="serif" style={{ fontSize: 28, fontWeight: 500 }}>{stat.value}</div>
            <div className="mono" style={{ fontSize: 10, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 32 }}>
        {/* ACTIVITY CHART */}
        <div className="card" style={{ padding: 24 }}>
          <div className="mono" style={{ marginBottom: 20 }}>Weekly Activity</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {activityData.map((d) => (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: "100%",
                    height: `${(d.tasks / maxTasks) * 100}%`,
                    background: "var(--accent)",
                    borderRadius: "4px 4px 0 0",
                    minHeight: 8,
                  }}
                />
                <span className="mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MODE DISTRIBUTION */}
        <div className="card" style={{ padding: 24 }}>
          <div className="mono" style={{ marginBottom: 20 }}>Mission Types</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { mode: "vex", label: "VEX Robotics", count: 18, color: "oklch(0.55 0.10 50)" },
              { mode: "hackathon", label: "Hackathon", count: 4, color: "var(--cosmic)" },
              { mode: "standard", label: "Standard", count: 2, color: "var(--info)" },
            ].map((item) => (
              <div key={item.mode}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}>{item.label}</span>
                  <span className="mono" style={{ fontSize: 11 }}>{item.count}</span>
                </div>
                <div style={{ height: 6, background: "var(--paper-2)", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.count / 24) * 100}%`,
                      background: item.color,
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT MISSIONS */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="mono">Recent Missions</div>
          <a href="/dashboard" style={{ fontSize: 12, color: "var(--accent-ink)", display: "flex", alignItems: "center", gap: 4 }}>
            View All <Ic name="arrow-r" size={11} />
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentMissions.map((m) => (
            <div
              key={m.title}
              style={{
                display: "flex",
                alignItems: "center",
                padding: 14,
                background: "var(--paper-2)",
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Ic name="rocket" size={16} color="var(--accent-ink)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{m.title}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{m.date}</div>
              </div>
              <div
                className="badge"
                style={{
                  background: modeColors[m.mode],
                  color: "white",
                  marginRight: 16,
                }}
              >
                {m.mode}
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--ink-3)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Ic name="target" size={12} />
                  {m.tasks}
                </span>
                {m.anomalies > 0 && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Ic name="alert-triangle" size={12} />
                    {m.anomalies}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}