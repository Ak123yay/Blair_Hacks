"use client";

import { Ic } from "@/components/icons/Ic";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Scout",
    price: "Free",
    period: "forever",
    desc: "Perfect for getting started",
    features: [
      "Unlimited missions",
      "All AI generation modes",
      "Custom categories",
      "Timeline view",
      "JSON & Markdown export",
      "Audio transcription",
    ],
    cta: "Current Plan",
    highlighted: false,
    current: true,
  },
  {
    name: "Commander",
    price: "$9",
    period: "per month",
    desc: "For serious teams",
    features: [
      "Everything in Scout",
      "Team collaboration",
      "Real-time editing",
      "PDF export for judges",
      "Analytics dashboard",
      "Priority AI generation",
      "Email notifications",
    ],
    cta: "Coming Soon",
    highlighted: true,
    current: false,
  },
  {
    name: "Fleet",
    price: "$29",
    period: "per month",
    desc: "For organizations",
    features: [
      "Everything in Commander",
      "Unlimited team members",
      "Custom AI prompts",
      "API access",
      "SSO / SAML",
      "Dedicated support",
      "Custom branding",
    ],
    cta: "Coming Soon",
    highlighted: false,
    current: false,
  },
];

export default function UpgradePage() {
  const { user } = useAuth();

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Pricing</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Choose your <span className="serif-italic">plan</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 8 }}>
          You&apos;re currently on the <strong>Scout</strong> plan. {user?.email && `Signed in as ${user.email}.`}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="card hover-lift"
            style={{
              padding: 32,
              borderColor: plan.highlighted ? "var(--accent)" : undefined,
              position: "relative",
            }}
          >
            {plan.highlighted && (
              <div className="badge badge-accent" style={{ position: "absolute", top: -10, right: 16 }}>
                Popular
              </div>
            )}
            <div className="mono" style={{ marginBottom: 8 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
              <span className="serif" style={{ fontSize: 40, fontWeight: 500 }}>{plan.price}</span>
              {plan.period !== "forever" && <span style={{ fontSize: 14, color: "var(--ink-3)" }}>/{plan.period.replace("per ", "")}</span>}
            </div>
            <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 24 }}>{plan.desc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {plan.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <Ic name="check" size={14} color="var(--leaf)" />
                  {f}
                </div>
              ))}
            </div>
            <button
              className={plan.highlighted ? "btn btn-accent" : plan.current ? "btn btn-soft" : "btn btn-ghost"}
              style={{ width: "100%" }}
              disabled={plan.current}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 32, textAlign: "center", background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
        <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: "0 0 8px" }}>
          Paid plans coming soon
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-4)", marginBottom: 20 }}>
          We&apos;re working on team collaboration, PDF export, and analytics. Want early access?
        </p>
        <a href="mailto:support@missionlog.app" className="btn btn-accent">
          <Ic name="mail" size={16} /> Request Early Access
        </a>
      </div>
    </>
  );
}