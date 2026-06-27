"use client";

import { useState } from "react";
import { Ic } from "@/components/icons/Ic";

const faqs = [
  { q: "How do I create a mission log?", a: "Click 'New Mission' in the sidebar, select your mission mode (or type a custom category), paste your meeting transcript, and our AI will generate structured documentation in about 20 seconds." },
  { q: "How does the AI understand my transcript?", a: "We use GLM 5.1 with specialized prompts for each mission mode. The AI extracts tasks, decisions, anomalies, and generates competition-ready documentation tailored to your team type." },
  { q: "What is the Custom category?", a: "Instead of choosing a predefined mode, type your own category (e.g., 'Podcast Production', 'Film Crew', 'Construction'). The AI will auto-generate a custom prompt with industry-specific terminology and documentation standards." },
  { q: "Can I upload audio recordings?", a: "Yes! Drag and drop an audio or video file on the New Mission page. We use AssemblyAI for speech-to-text transcription. Requires an AssemblyAI API key to be configured." },
  { q: "Is my data secure?", a: "Missions are stored in Supabase with Row Level Security — only you can access your data. For AI generation, transcripts are sent securely to GLM API and not retained. We never sell or share your data." },
  { q: "Can I export my mission logs?", a: "Yes! Go to Settings → Data & Export to download all your missions as JSON or Markdown. The Markdown export includes formatted engineering notebook entries suitable for judges." },
];

const guides = [
  { title: "Getting Started", desc: "Create your first mission log", icon: "rocket", articles: ["Setting up your account", "Creating your first mission", "Understanding the output"] },
  { title: "Mission Modes", desc: "Choose the right documentation style", icon: "target", articles: ["Standard vs VEX vs Hackathon", "Using Custom categories", "Startup & Research modes"] },
  { title: "Audio Transcription", desc: "Record and auto-transcribe meetings", icon: "upload", articles: ["Uploading audio files", "Supported formats", "Transcription accuracy tips"] },
  { title: "Export & Sharing", desc: "Download and share mission logs", icon: "download", articles: ["Exporting as JSON", "Exporting as Markdown", "Sharing with judges"] },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (f) =>
      !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGuides = guides.filter(
    (g) =>
      !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.desc.toLowerCase().includes(search.toLowerCase()) ||
      g.articles.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Help Center</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>How can we help?</h1>
      </div>

      <div className="card" style={{ padding: 32, marginBottom: 32, background: "var(--accent-softer)", borderColor: "transparent" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search for help articles, guides, FAQs..."
              className="input"
              style={{ paddingLeft: 44 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
              <Ic name="search" size={18} color="var(--ink-3)" />
            </div>
          </div>
        </div>
      </div>

      {filteredGuides.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {filteredGuides.map((guide) => (
            <div key={guide.title} className="card hover-lift" style={{ padding: 20, cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Ic name={guide.icon} size={18} color="var(--accent-ink)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{guide.title}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 12 }}>{guide.desc}</div>
              {guide.articles.map((article) => (
                <div key={article} style={{ fontSize: 12, color: "var(--accent-ink)", padding: "4px 0", cursor: "pointer" }}>{article}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 24, marginBottom: 32 }}>
        <div className="mono" style={{ marginBottom: 20 }}>Frequently Asked Questions</div>
        {filteredFaqs.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, color: "var(--ink-3)" }}>No results for &ldquo;{search}&rdquo;</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {filteredFaqs.map((faq, i) => (
              <details key={i} style={{ borderBottom: "1px solid var(--rule-2)" }}>
                <summary style={{ padding: "16px 0", cursor: "pointer", fontSize: 14, fontWeight: 500, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q}
                  <Ic name="chevron_down" size={14} color="var(--ink-4)" />
                </summary>
                <div style={{ padding: "0 0 16px", fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6 }}>{faq.a}</div>
              </details>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <a href="mailto:support@missionlog.app" className="card hover-lift" style={{ padding: 20, textAlign: "center", textDecoration: "none", color: "inherit" }}>
          <div style={{ marginBottom: 8 }}><Ic name="mail" size={20} color="var(--accent-ink)" /></div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Email Us</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>support@missionlog.app</div>
        </a>
        <a href="/new" className="card hover-lift" style={{ padding: 20, textAlign: "center", textDecoration: "none", color: "inherit" }}>
          <div style={{ marginBottom: 8 }}><Ic name="sparkle" size={20} color="var(--accent-ink)" /></div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Try It Out</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>Create a mission log</div>
        </a>
        <a href="/changelog" className="card hover-lift" style={{ padding: 20, textAlign: "center", textDecoration: "none", color: "inherit" }}>
          <div style={{ marginBottom: 8 }}><Ic name="history" size={20} color="var(--accent-ink)" /></div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Changelog</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>See what&apos;s new</div>
        </a>
      </div>
    </>
  );
}
