"use client";

import DashShell from "@/components/DashShell";
import { Ic } from "@/components/icons/Ic";

const changelog = [
  {
    version: "2.4.0",
    date: "December 15, 2025",
    type: "major",
    title: "VEX Notebook Templates",
    description: "New competition-ready templates specifically designed for VEX Engineering Notebooks. Includes decision matrices, test data tables, and iteration tracking.",
    changes: [
      "Added VEX-specific engineering notebook template",
      "Decision matrix generator for design choices",
      "Test data table formatting with automatic units",
      "Iteration history tracking between missions",
      "Export to official VEX notebook PDF format",
    ],
  },
  {
    version: "2.3.0",
    date: "November 28, 2025",
    type: "major",
    title: "Team Collaboration",
    description: "Invite team members, assign roles, and collaborate on missions in real-time.",
    changes: [
      "Team member invitations via email",
      "Role-based permissions (Admin, Member, Viewer)",
      "Comments and mentions on missions",
      "Activity feed for team actions",
      "Shared mission dashboards",
    ],
  },
  {
    version: "2.2.0",
    date: "November 10, 2025",
    type: "minor",
    title: "Analytics Dashboard",
    description: "Track your team's progress with detailed analytics and insights.",
    changes: [
      "Weekly activity charts",
      "Mission type distribution",
      "Task completion tracking",
      "Team velocity metrics",
      "Export analytics to CSV",
    ],
  },
  {
    version: "2.1.0",
    date: "October 22, 2025",
    type: "minor",
    title: "Hackathon Mode",
    description: "New mission mode optimized for hackathon sprints and demo preparation.",
    changes: [
      "Hackathon-specific AI prompts",
      "Feature tracking and sprint logs",
      "Demo script generator",
      "Pitch talking points extraction",
      "Tech stack documentation",
    ],
  },
  {
    version: "2.0.0",
    date: "October 1, 2025",
    type: "major",
    title: "GLM 5.1 Integration",
    description: "Upgraded to GLM 5.1 for significantly better AI generation quality.",
    changes: [
      "2x better task extraction accuracy",
      "Improved context understanding",
      "More detailed engineering notebook entries",
      "Better handling of technical terminology",
      "Faster generation (~20 seconds)",
    ],
  },
  {
    version: "1.5.0",
    date: "September 15, 2025",
    type: "minor",
    title: "Timeline View",
    description: "Visualize your project's evolution with a chronological timeline.",
    changes: [
      "Chronological mission timeline",
      "Date-based grouping",
      "Quick navigation between missions",
      "Next steps preview on timeline cards",
    ],
  },
];

const typeColors: Record<string, string> = {
  major: "var(--accent)",
  minor: "var(--info)",
  patch: "var(--ink-4)",
};

export default function ChangelogPage() {
  return (
    <DashShell>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Product Updates</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Changelog
        </h1>
      </div>

      {/* LATEST UPDATE HIGHLIGHT */}
      <div
        className="card"
        style={{
          padding: 32,
          marginBottom: 32,
          background: "var(--accent-softer)",
          borderColor: "var(--accent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span
            className="badge"
            style={{ background: "var(--accent)", color: "white", fontSize: 10 }}
          >
            Latest
          </span>
          <span className="mono" style={{ color: "var(--accent-ink)" }}>
            Version {changelog[0].version} · {changelog[0].date}
          </span>
        </div>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: "0 0 8px" }}>
          {changelog[0].title}
        </h2>
        <p style={{ fontSize: 15, color: "var(--ink-3)", marginBottom: 20 }}>
          {changelog[0].description}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/new" className="btn btn-accent">
            <Ic name="rocket" size={16} />
            Try It Now
          </a>
          <a href="/help" className="btn btn-ghost">
            <Ic name="book" size={16} />
            Learn More
          </a>
        </div>
      </div>

      {/* CHANGELOG ENTRIES */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {changelog.map((entry, i) => (
          <div key={entry.version} className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: typeColors[entry.type],
                }}
              />
              <span className="mono" style={{ fontSize: 11 }}>
                v{entry.version}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{entry.title}</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: "auto" }}>
                {entry.date}
              </span>
            </div>

            <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 16 }}>
              {entry.description}
            </p>

            <ul style={{ margin: 0, padding: "0 0 0 20px" }}>
              {entry.changes.map((change) => (
                <li key={change} style={{ fontSize: 13, color: "var(--ink-2)", padding: "4px 0", lineHeight: 1.6 }}>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* SUBSCRIBE TO UPDATES */}
      <div
        className="card"
        style={{
          padding: 32,
          marginTop: 40,
textAlign: "center",
          background: "var(--ink)",
          color: "var(--paper)",
          borderColor: "var(--ink)",
        }}
      >
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
          <Ic name="bell" size={32} color="var(--accent)" />
        </div>
        <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: "0 0 8px" }}>
          Stay Updated
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-4)", marginBottom: 24 }}>
          Get notified about new features and improvements
        </p>
        <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            style={{ flex: 1, background: "var(--paper)" }}
          />
          <button className="btn btn-accent">Subscribe</button>
        </div>
      </div>
    </DashShell>
  );
}