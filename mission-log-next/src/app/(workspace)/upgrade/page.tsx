"use client";

import DashShell from "@/components/DashShell";
import { Ic } from "@/components/icons/Ic";

const plans = [
  {
    name: "Scout",
    price: "Free",
    period: "forever",
    desc: "Perfect for getting started",
    features: [
      "5 missions per month",
      "Basic AI generation (Standard mode)",
      "Timeline view",
      "Export to PDF",
      "Local storage",
      "Community support",
    ],
    notIncluded: ["Advanced AI modes", "Team collaboration", "Analytics", "API access"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Commander",
    price: "$9",
    period: "per month",
    desc: "For serious teams",
    features: [
      "Unlimited missions",
      "All AI modes (VEX, Hackathon, Standard)",
      "Priority generation (~15 seconds)",
      "Team collaboration (up to 10 members)",
      "Analytics dashboard",
      "Export to PDF, Markdown, JSON",
      "Email support",
      "Version history",
    ],
    notIncluded: ["API access", "Custom branding", "SSO"],
    cta: "Start 14-Day Trial",
    highlighted: true,
  },
  {
    name: "Fleet",
    nameBadge: "Best Value",
    price: "$29",
    period: "per month",
    desc: "Multiple teams & projects",
    features: [
      "Everything in Commander",
      "Unlimited team members",
      "Multiple projects/teams",
      "API access (1000 calls/month)",
      "Custom branding",
      "Priority support",
      "Dedicated success manager",
      "Custom integrations",
      "SSO & advanced security",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const comparison = [
  { feature: "Missions per month", scout: "5", commander: "Unlimited", fleet: "Unlimited" },
  { feature: "AI Modes", scout: "Standard", commander: "All", fleet: "All + Custom" },
  { feature: "Generation Speed", scout: "~30s", commander: "~15s", fleet: "~10s" },
  { feature: "Team Members", scout: "1", commander: "10", fleet: "Unlimited" },
  { feature: "Analytics", scout: false, commander: true, fleet: true },
  { feature: "API Access", scout: false, commander: false, fleet: true },
  { feature: "Custom Branding", scout: false, commander: false, fleet: true },
  { feature: "Support", scout: "Community", commander: "Email", fleet: "Priority + Manager" },
];

export default function UpgradePage() {
  return (
    <DashShell>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Pricing</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Choose your <span className="serif-italic">mission plan</span>
        </h1>
      </div>

      {/* PRICING CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card hover-lift${plan.highlighted ? " card-accent" : ""}`}
            style={{
              padding: 32,
              position: "relative",
              border: plan.highlighted ? "2px solid var(--accent)" : undefined,
              transform: plan.highlighted ? "scale(1.02)" : undefined,
            }}
          >
            {plan.highlighted && (
              <div
                className="badge badge-accent"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "var(--accent)",
                  color: "white",
                }}
              >
                Most Popular
              </div>
            )}
            {plan.nameBadge && (
              <div
                className="badge badge-accent"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "var(--leaf)",
                  color: "white",
                }}
              >
                {plan.nameBadge}
              </div>
            )}

            <div className="mono" style={{ marginBottom: 8 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
              <span className="serif" style={{ fontSize: 42, fontWeight: 500 }}>{plan.price}</span>
              <span style={{ fontSize: 13, color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--ink-3)" }}>
                {plan.period}
              </span>
            </div>
            <p style={{ fontSize: 13, color: plan.highlighted ? "rgba(255,255,255,0.8)" : "var(--ink-3)", marginBottom: 24 }}>
              {plan.desc}
            </p>

            <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none" }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", fontSize: 13.5 }}>
                  <Ic name="check" size={14} color={plan.highlighted ? "var(--leaf)" : "var(--leaf)"} />
                  {f}
                </li>
              ))}
            </ul>

            {plan.notIncluded.length > 0 && (
              <ul style={{ margin: "0 0 24px", padding: 0, listStyle: "none", opacity: 0.5 }}>
                {plan.notIncluded.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", fontSize: 13 }}>
                    <Ic name="x" size={14} color={plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--ink-4)"} />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <button
              className={`btn${plan.highlighted ? " btn-ghost" : " btn-soft"}`}
              style={{ width: "100%" }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* COMPARISON TABLE */}
      <div className="card" style={{ padding: 24, marginBottom: 40 }}>
        <div className="mono" style={{ marginBottom: 20 }}>Feature Comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--rule)" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 500 }}>Feature</th>
                <th style={{ textAlign: "center", padding: "12px 16px", fontWeight: 500 }}>Scout</th>
                <th style={{ textAlign: "center", padding: "12px 16px", fontWeight: 500, background: "var(--accent-soft)" }}>Commander</th>
                <th style={{ textAlign: "center", padding: "12px 16px", fontWeight: 500 }}>Fleet</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} style={{ borderBottom: "1px solid var(--rule-2)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{row.feature}</td>
                  <td style={{ textAlign: "center", padding: "12px 16px", color: "var(--ink-3)" }}>
                    {typeof row.scout === "boolean" ? (
                      row.scout ? (
                        <Ic name="check" size={16} color="var(--leaf)" />
                      ) : (
                        <Ic name="x" size={16} color="var(--ink-4)" />
                      )
                    ) : (
                      row.scout
                    )}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 16px", background: "var(--accent-softer)" }}>
                    {typeof row.commander === "boolean" ? (
                      row.commander ? (
                        <Ic name="check" size={16} color="var(--leaf)" />
                      ) : (
                        <Ic name="x" size={16} color="var(--ink-4)" />
                      )
                    ) : (
                      row.commander
                    )}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 16px", color: "var(--ink-3)" }}>
                    {typeof row.fleet === "boolean" ? (
                      row.fleet ? (
                        <Ic name="check" size={16} color="var(--leaf)" />
                      ) : (
                        <Ic name="x" size={16} color="var(--ink-4)" />
                      )
                    ) : (
                      row.fleet
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 className="serif" style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
            Can I change plans later?
          </h3>
          <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
            Yes! You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.
          </p>
        </div>
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 className="serif" style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
            What happens if I exceed the Scout limit?
          </h3>
          <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
            You'll be notified when you're approaching your limit. Upgrade to Commander for unlimited missions.
          </p>
        </div>
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 className="serif" style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
            Do you offer discounts for students?
          </h3>
          <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
            Yes! Student teams get 50% off Commander and Fleet plans. Contact us with your school email for verification.
          </p>
        </div>
      </div>

      {/* FINAL CTA */}
      <div
        className="card"
        style={{
          padding: 40,
          marginTop: 40,
          textAlign: "center",
          background: "var(--accent)",
          color: "white",
          borderColor: "var(--accent)",
        }}
      >
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: "0 0 12px" }}>
          Ready to upgrade your mission documentation?
        </h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", marginBottom: 24 }}>
          Start your 14-day free trial of Commander today. No credit card required.
        </p>
        <button className="btn" style={{ background: "white", color: "var(--accent)" }}>
          Start Free Trial
        </button>
      </div>
    </DashShell>
  );
}