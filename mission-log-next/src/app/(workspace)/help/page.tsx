"use client";


import { Ic } from "@/components/icons/Ic";

const faqs = [
  {
    q: "How do I create a mission log?",
    a: "Click 'New Mission' in the navigation bar, select your mission mode (Standard, VEX, or Hackathon), paste your meeting transcript or notes, and our AI will generate structured documentation in about 20 seconds.",
  },
  {
    q: "What makes a good engineering notebook entry?",
    a: "VEX judges look for: clear problem definitions, documented brainstorming processes, decision matrices with rationale, specific test data (measurements, times, scores), iteration tracking, and evidence of the engineering design process. Our AI automatically formats entries to include all these elements.",
  },
  {
    q: "Can I export my documentation for competitions?",
    a: "Yes! Go to Settings → Data & Export to download all your missions as a PDF formatted for judge review, or export individual missions as Markdown or JSON.",
  },
  {
    q: "How does the AI understand my transcript?",
    a: "MissionLog uses GLM 5.1, trained on engineering documentation patterns. It identifies decisions, tasks, problems, and next steps from context. The more specific your notes (names, measurements, part numbers), the better the output.",
  },
  {
    q: "Is my data stored securely?",
    a: "All mission data is stored locally in your browser by default. For AI generation, transcripts are sent securely to GLM API and not retained. We never sell or share your data.",
  },
];

const guides = [
  {
    icon: "rocket",
    title: "Getting Started",
    desc: "Learn the basics of MissionLog",
    articles: ["Creating your first mission", "Understanding mission modes", "Navigating the dashboard"],
  },
  {
    icon: "book",
    title: "Engineering Notebooks",
    desc: "Competition-ready documentation",
    articles: ["VEX notebook requirements", "FIRST documentation standards", "What judges look for"],
  },
  {
    icon: "target",
    title: "Best Practices",
    desc: "Tips for effective documentation",
    articles: ["Writing effective transcripts", "Task assignment strategies", "Tracking design iterations"],
  },
  {
    icon: "users",
    title: "Team Collaboration",
    desc: "Working together effectively",
    articles: ["Inviting team members", "Setting roles and permissions", "Review and comment workflows"],
  },
];

export default function HelpPage() {
  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Support</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Help <span className="serif-italic">Center</span>
        </h1>
      </div>

      {/* SEARCH */}
      <div
        className="card"
        style={{
          padding: 32,
          marginBottom: 32,
          background: "var(--accent-softer)",
          borderColor: "transparent",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <Ic name="search" size={24} color="var(--accent-ink)" />
          </div>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: "0 0 8px" }}>
            How can we help?
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 20 }}>
            Search our knowledge base for answers
          </p>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search for help articles, guides, FAQs..."
              className="input"
              style={{ paddingLeft: 44 }}
            />
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
              <Ic name="search" size={18} color="var(--ink-3)" />
            </div>
          </div>
        </div>
      </div>

      {/* GUIDES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {guides.map((guide) => (
          <div key={guide.title} className="card hover-lift" style={{ padding: 20 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ic name={guide.icon} size={20} color="var(--accent-ink)" />
            </div>
            <h3 className="serif" style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
              {guide.title}
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12 }}>{guide.desc}</p>
            <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "none" }}>
              {guide.articles.map((article) => (
                <li key={article} style={{ fontSize: 12, color: "var(--accent-ink)", padding: "3px 0", cursor: "pointer" }}>
                  → {article}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* FAQ */}
        <div className="card" style={{ padding: 24 }}>
          <div className="mono" style={{ marginBottom: 20 }}>Frequently Asked Questions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq) => (
              <div key={faq.q} style={{ padding: 16, background: "var(--paper-2)", borderRadius: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ marginBottom: 16 }}>Still need help?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="btn btn-soft" style={{ justifyContent: "flex-start" }}>
                <Ic name="message" size={16} />
                Chat with support
              </button>
              <button className="btn btn-soft" style={{ justifyContent: "flex-start" }}>
                <Ic name="mail" size={16} />
                Email us
              </button>
              <button className="btn btn-soft" style={{ justifyContent: "flex-start" }}>
                <Ic name="book" size={16} />
                Request a demo
              </button>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: 24,
              background: "var(--accent)",
              color: "white",
              borderColor: "var(--accent)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Ic name="sparkle" size={18} color="white" />
              <span style={{ fontSize: 14, fontWeight: 500 }}>AI Assistant</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>
              Get instant answers from our AI about using MissionLog
            </p>
            <button className="btn" style={{ background: "white", color: "var(--accent)", width: "100%" }}>
              Start Chat
            </button>
          </div>
        </div>
      </div>

      {/* KEYBOARD SHORTCUTS */}
      <div className="card" style={{ padding: 24, marginTop: 20 }}>
        <div className="mono" style={{ marginBottom: 16 }}>Keyboard Shortcuts</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { action: "New Mission", keys: ["N"] },
            { action: "Search", keys: ["Ctrl", "K"] },
            { action: "Go to Dashboard", keys: ["G", "D"] },
            { action: "Go to Timeline", keys: ["G", "T"] },
            { action: "Toggle Sidebar", keys: ["B"] },
            { action: "Help", keys: ["?"] },
          ].map((shortcut) => (
            <div key={shortcut.action} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13 }}>{shortcut.action}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {shortcut.keys.map((key) => (
                  <kbd key={key} className="kbd">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}