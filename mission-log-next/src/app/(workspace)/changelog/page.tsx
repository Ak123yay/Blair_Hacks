"use client";

import { Ic } from "@/components/icons/Ic";

const changelog = [
  {
    version: "1.3.0",
    date: "June 2026",
    type: "major",
    title: "Custom Categories & Expanded Modes",
    description: "Type any team category and AI auto-generates a custom prompt. Added Startup, Research, Freelance, and Enterprise modes.",
    changes: [
      "Custom category input with AI prompt engineering",
      "Startup mode: KPIs, user feedback, sprint tracking",
      "Research mode: experiments, methodology, publications",
      "Freelance mode: deliverables, time tracking, invoicing",
      "Enterprise mode: architecture, compliance, stakeholders",
    ],
  },
  {
    version: "1.2.0",
    date: "June 2026",
    type: "major",
    title: "Supabase Auth & Cloud Storage",
    description: "User accounts with email/password and Google OAuth. Missions saved to Supabase with per-user isolation and RLS.",
    changes: [
      "Email/password authentication via Supabase",
      "Google OAuth sign-in",
      "Cloud storage for missions (Supabase Postgres)",
      "Row Level Security for per-user data isolation",
      "Middleware route protection for dashboard pages",
    ],
  },
  {
    version: "1.1.0",
    date: "June 2026",
    type: "minor",
    title: "Audio Transcription",
    description: "Upload audio/video recordings and get auto-transcribed meeting notes via AssemblyAI.",
    changes: [
      "Audio/video file upload with drag-and-drop",
      "AssemblyAI speech-to-text integration",
      "Speaker diarization support",
      "Auto-populate transcript field from audio",
    ],
  },
  {
    version: "1.0.0",
    date: "June 2026",
    type: "major",
    title: "Initial Launch",
    description: "Turn meeting transcripts into structured engineering logs with AI. Built for Blair Hacks.",
    changes: [
      "AI-powered mission log generation (GLM 5.1)",
      "Standard, VEX Robotics, and Hackathon modes",
      "Task assignments, command decisions, anomaly tracking",
      "Judge-ready recaps and documentation warnings",
      "Dashboard with search and project filtering",
      "Timeline view for chronological progress",
      "Onara-inspired paper design system",
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
    <>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Product Updates</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>Changelog</h1>
      </div>

      <div className="card" style={{ padding: 32, marginBottom: 32, background: "var(--accent-softer)", borderColor: "var(--accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span className="badge" style={{ background: "var(--accent)", color: "white", fontSize: 10 }}>Latest</span>
          <span className="mono" style={{ color: "var(--accent-ink)" }}>
            Version {changelog[0].version} · {changelog[0].date}
          </span>
        </div>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: "0 0 8px" }}>{changelog[0].title}</h2>
        <p style={{ fontSize: 15, color: "var(--ink-3)", marginBottom: 20 }}>{changelog[0].description}</p>
        <a href="/new" className="btn btn-accent">
          <Ic name="rocket" size={16} /> Try It Now
        </a>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {changelog.map((entry) => (
          <div key={entry.version} className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: typeColors[entry.type] }} />
              <span className="mono" style={{ fontSize: 11 }}>v{entry.version}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{entry.title}</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)", marginLeft: "auto" }}>{entry.date}</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 16 }}>{entry.description}</p>
            <ul style={{ margin: 0, padding: "0 0 0 20px" }}>
              {entry.changes.map((change) => (
                <li key={change} style={{ fontSize: 13, color: "var(--ink-2)", padding: "4px 0", lineHeight: 1.6 }}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}