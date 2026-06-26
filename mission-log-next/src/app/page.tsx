"use client";

import Link from "next/link";
import { Ic } from "@/components/icons/Ic";

const features = [
  {
    icon: "sparkle",
    title: "AI-Powered Documentation",
    desc: "Turn messy meeting notes into structured engineering logs, task assignments, and judge-ready summaries in seconds.",
  },
  {
    icon: "target",
    title: "Task Tracking",
    desc: "Automatically extract action items, assign crew members, and track progress across missions.",
  },
  {
    icon: "clipboard-check",
    title: "Competition Ready",
    desc: "Generate documentation that meets VEX, FIRST, and hackathon judge requirements out of the box.",
  },
  {
    icon: "clock",
    title: "Timeline View",
    desc: "See your project's evolution over time with a chronological view of all missions and decisions.",
  },
  {
    icon: "users",
    title: "Team Collaboration",
    desc: "Share mission logs with your team, assign roles, and keep everyone aligned on goals.",
  },
  {
    icon: "shield",
    title: "Evidence Tracking",
    desc: "Automatic checklists for proof items judges look for: test data, photos, code screenshots, and more.",
  },
];

const testimonials = [
  {
    quote: "MissionLog turned our scattered notes into competition-winning documentation. We placed 2nd at Worlds!",
    author: "Team 17392",
    role: "VEX Robotics",
  },
  {
    quote: "The AI actually understands engineering context. It's like having a dedicated documentation engineer.",
    author: "Sarah Chen",
    role: "Hackathon Winner",
  },
  {
    quote: "Judges specifically commented on how professional our engineering notebook was. MissionLog made that possible.",
    author: "Team Momentum",
    role: "FIRST Robotics",
  },
];

const pricingPlans = [
  {
    name: "Scout",
    price: "Free",
    desc: "Perfect for getting started",
    features: ["5 missions per month", "Basic AI generation", "Timeline view", "Export to PDF"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Commander",
    price: "$9/mo",
    desc: "For serious teams",
    features: ["Unlimited missions", "Advanced AI modes (VEX, Hackathon)", "Team collaboration", "Analytics dashboard", "Priority support"],
    cta: "Start Trial",
    highlighted: true,
  },
  {
    name: "Fleet",
    price: "$29/mo",
    desc: "Multiple teams & projects",
    features: ["Everything in Commander", "Unlimited team members", "Multiple projects", "API access", "Custom branding"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "How does the AI generation work?",
    a: "MissionLog uses GLM 5.1 to analyze your meeting transcripts and automatically extract engineering decisions, tasks, anomalies, and generate structured documentation. It understands context specific to VEX Robotics, hackathons, and general engineering teams.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All mission data is stored locally in your browser by default. We never send your transcripts to external servers except for AI generation, and those are processed securely via GLM API.",
  },
  {
    q: "Can I export my documentation?",
    a: "Absolutely. Export to PDF, Markdown, or plain text formats. Perfect for submitting to competitions or sharing with mentors and judges.",
  },
  {
    q: "Does this work for non-robotics teams?",
    a: "Yes! While optimized for robotics and hackathons, the Standard mode works great for any engineering team that needs structured meeting documentation.",
  },
];

export default function LandingPage() {
  return (
    <div className="fadein-up">
      {/* HERO */}
      <section style={{ padding: "80px 0 100px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <div className="badge badge-accent" style={{ marginBottom: 20 }}>
          <Ic name="sparkle" size={12} />
          Powered by GLM 5.1
        </div>
        <h1 className="serif" style={{ fontSize: 64, fontWeight: 400, margin: 0, lineHeight: 1.05 }}>
          Turn team meetings into
          <br />
          <span className="serif-italic">mission control documentation</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-3)", marginTop: 24, maxWidth: 640, margin: "24px auto 0" }}>
          AI-powered engineering notebook for robotics and hackathon teams. Generate judge-ready logs, task assignments, and progress summaries from your meeting notes.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
          <Link href="/new" className="btn btn-accent btn-lg">
            <Ic name="rocket" size={16} />
            Start Your First Mission
          </Link>
          <a href="#features" className="btn btn-ghost btn-lg">
            <Ic name="arrow-down" size={16} />
            Learn More
          </a>
        </div>
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, fontSize: 13, color: "var(--ink-4)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="check" size={14} color="var(--leaf)" />
            No credit card required
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="check" size={14} color="var(--leaf)" />
            5 free missions
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Ic name="check" size={14} color="var(--leaf)" />
            VEX & FIRST ready
          </span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 40px", background: "var(--paper-2)", borderRadius: 8 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="eyebrow">Features</div>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: "12px 0" }}>
              Everything you need for
              <span className="serif-italic"> competition success</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="card hover-lift" style={{ padding: 28 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--accent-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ic name={f.icon} size={20} color="var(--accent-ink)" />
                </div>
                <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="eyebrow">How It Works</div>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: "12px 0" }}>
            From notes to notebook in
            <span className="serif-italic"> three steps</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, textAlign: "center" }}>
          {[
            { step: "1", title: "Paste Notes", desc: "Drop in your meeting transcript, voice notes, or rough team notes" },
            { step: "2", title: "AI Analysis", desc: "GLM 5.1 extracts decisions, tasks, and generates structured documentation" },
            { step: "3", title: "Review & Save", desc: "Edit if needed, then save to your flight log or export for judges" },
          ].map((item) => (
            <div key={item.step}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: 22,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontFamily: "var(--serif)",
                }}
              >
                {item.step}
              </div>
              <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, margin: "0 0 8px" }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 40px", background: "var(--ink)", color: "var(--paper)", borderRadius: 8 }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="eyebrow" style={{ color: "var(--accent-soft)" }}>Testimonials</div>
            <h2 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: "12px 0", color: "var(--paper)" }}>
              Trusted by
              <span className="serif-italic"> winning teams</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.map((t) => (
              <div key={t.author} className="card" style={{ padding: 28, background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 32, color: "var(--accent)", marginBottom: 16 }}>"</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, margin: "0 0 20px", color: "rgba(255,255,255,0.9)" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--accent-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-ink)",
                      fontWeight: 600,
                      fontFamily: "var(--serif)",
                    }}
                  >
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.author}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="eyebrow">Pricing</div>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: "12px 0" }}>
            Start free, upgrade for
            <span className="serif-italic"> more power</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`card hover-lift${plan.highlighted ? " card-accent" : ""}`}
              style={{
                padding: 32,
                position: "relative",
                border: plan.highlighted ? "2px solid var(--accent)" : undefined,
              }}
            >
              {plan.highlighted && (
                <div
                  className="badge badge-accent"
                  style={{ position: "absolute", top: 16, right: 16, background: "var(--accent)", color: "white" }}
                >
                  Most Popular
                </div>
              )}
              <div className="mono" style={{ marginBottom: 8 }}>{plan.name}</div>
              <div className="serif" style={{ fontSize: 36, fontWeight: 500, marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontSize: 13, color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--ink-3)", marginBottom: 20 }}>{plan.desc}</div>
              <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0", fontSize: 13.5 }}>
                    <Ic name="check" size={14} color={plan.highlighted ? "var(--leaf)" : "var(--leaf)"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`btn${plan.highlighted ? " btn-ghost" : " btn-soft"}`}
                style={{ width: "100%" }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 40px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="eyebrow">FAQ</div>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: "12px 0" }}>
            Common
            <span className="serif-italic"> questions</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq) => (
            <div key={faq.q} className="card" style={{ padding: 24 }}>
              <h3 className="serif" style={{ fontSize: 16, fontWeight: 500, margin: "0 0 8px" }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "100px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>
            Ready to launch your
            <span className="serif-italic"> engineering notebook?</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-3)", marginTop: 16, marginBottom: 32 }}>
            Join hundreds of teams using MissionLog to document their journey to competition success.
          </p>
          <Link href="/new" className="btn btn-accent btn-lg">
            <Ic name="rocket" size={18} />
            Create Your First Mission — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--rule-2)", padding: "60px 40px", background: "var(--paper-2)" }}>
        <div className="container" style={{ maxWidth: 1100, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          <div>
            <Link href="/" className="missionlog-logo" style={{ marginBottom: 16 }}>
              <div className="missionlog-logo-mark" />
              Mission<span className="serif-italic">Log</span>
            </Link>
            <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.6 }}>
              AI-powered engineering documentation for robotics and hackathon teams.
            </p>
          </div>
          <div>
            <div className="mono" style={{ marginBottom: 16 }}>Product</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li><a href="#features" style={{ fontSize: 13, color: "var(--ink-3)" }}>Features</a></li>
              <li><a href="/pricing" style={{ fontSize: 13, color: "var(--ink-3)" }}>Pricing</a></li>
              <li><a href="/changelog" style={{ fontSize: 13, color: "var(--ink-3)" }}>Changelog</a></li>
            </ul>
          </div>
          <div>
            <div className="mono" style={{ marginBottom: 16 }}>Resources</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li><a href="/help" style={{ fontSize: 13, color: "var(--ink-3)" }}>Help Center</a></li>
              <li><a href="/docs" style={{ fontSize: 13, color: "var(--ink-3)" }}>Documentation</a></li>
              <li><a href="/team" style={{ fontSize: 13, color: "var(--ink-3)" }}>Team</a></li>
            </ul>
          </div>
          <div>
            <div className="mono" style={{ marginBottom: 16 }}>Legal</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li><a href="/privacy" style={{ fontSize: 13, color: "var(--ink-3)" }}>Privacy</a></li>
              <li><a href="/terms" style={{ fontSize: 13, color: "var(--ink-3)" }}>Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}