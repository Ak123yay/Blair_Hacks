"use client";

import { useState } from "react";
import DashShell from "@/components/DashShell";
import { Ic } from "@/components/icons/Ic";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: "cog" },
    { id: "profile", label: "Profile", icon: "user" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "integrations", label: "Integrations", icon: "plug" },
    { id: "data", label: "Data & Export", icon: "database" },
    { id: "billing", label: "Billing", icon: "credit-card" },
  ];

  return (
    <DashShell>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Configuration</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Settings
        </h1>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {/* SIDEBAR TABS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sidebar-link${activeTab === tab.id ? " active" : ""}`}
              style={{ justifyContent: "flex-start", textAlign: "left" }}
            >
              <Ic name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, maxWidth: 640 }}>
          {activeTab === "general" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>General Settings</h2>

              <div style={{ marginBottom: 24 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                  Default Mission Mode
                </label>
                <select className="input" defaultValue="standard">
                  <option value="standard">Standard</option>
                  <option value="vex">VEX Robotics</option>
                  <option value="hackathon">Hackathon</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                  Team Name
                </label>
                <input type="text" className="input" defaultValue="Blair_Hacks" />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
                  <span style={{ fontSize: 14 }}>Enable AI suggestions for task assignments</span>
                </label>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
                  <span style={{ fontSize: 14 }}>Show tutorial tooltips on first visit</span>
                </label>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: "var(--accent)" }} />
                  <span style={{ fontSize: 14 }}>Dark mode (coming soon)</span>
                </label>
              </div>

              <button className="btn btn-accent">Save Changes</button>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Profile Settings</h2>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 32,
                    fontFamily: "var(--serif)",
                  }}
                >
                  A
                </div>
                <div>
                  <button className="btn btn-soft btn-sm">Change Avatar</button>
                  <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }}>Remove</button>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                  Full Name
                </label>
                <input type="text" className="input" defaultValue="Alex Johnson" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                  Email
                </label>
                <input type="email" className="input" defaultValue="alex@example.com" />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                  Bio
                </label>
                <textarea className="input" rows={4} defaultValue="Robotics team captain passionate about engineering and design." />
              </div>

              <button className="btn btn-accent">Update Profile</button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Notification Preferences</h2>

              {[
                { label: "Email notifications for task assignments", defaultChecked: true },
                { label: "Email digest of weekly activity", defaultChecked: false },
                { label: "Push notifications for mission reminders", defaultChecked: true },
                { label: "Notification when team member comments", defaultChecked: true },
                { label: "Product updates and announcements", defaultChecked: false },
              ].map((item) => (
                <label
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--rule-2)",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                  <input type="checkbox" defaultChecked={item.defaultChecked} style={{ accentColor: "var(--accent)" }} />
                </label>
              ))}
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Integrations</h2>

              {[
                { name: "GitHub", desc: "Link commits to missions", connected: true },
                { name: "Google Drive", desc: "Export notebooks to Drive", connected: false },
                { name: "Slack", desc: "Post updates to channels", connected: false },
                { name: "Notion", desc: "Sync documentation", connected: false },
              ].map((int) => (
                <div
                  key={int.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--rule-2)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "var(--paper-2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic name={int.connected ? "check-circle" : "external"} size={18} color={int.connected ? "var(--leaf)" : "var(--ink-3)"} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{int.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{int.desc}</div>
                    </div>
                  </div>
                  <button className={int.connected ? "btn btn-soft btn-sm" : "btn btn-accent btn-sm"}>
                    {int.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "data" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Data & Export</h2>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, marginBottom: 8 }}>Export All Data</div>
                <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12 }}>
                  Download all your mission logs, settings, and team data in JSON format.
                </p>
                <button className="btn btn-soft">
                  <Ic name="download" size={14} />
                  Export JSON
                </button>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, marginBottom: 8 }}>Export Engineering Notebook</div>
                <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12 }}>
                  Generate a PDF of all missions formatted for competition judges.
                </p>
                <button className="btn btn-soft">
                  <Ic name="download" size={14} />
                  Export PDF
                </button>
              </div>

              <div style={{ paddingTop: 24, borderTop: "1px solid var(--rule-2)" }}>
                <div style={{ fontSize: 14, marginBottom: 8, color: "oklch(0.55 0.15 25)" }}>Danger Zone</div>
                <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12 }}>
                  Once you delete your data, there is no going back. Please be certain.
                </p>
                <button className="btn" style={{ borderColor: "oklch(0.55 0.15 25)", color: "oklch(0.55 0.15 25)" }}>
                  <Ic name="trash" size={14} />
                  Delete All Data
                </button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Billing & Subscription</h2>

              <div
                style={{
                  padding: 20,
                  background: "var(--accent-softer)",
                  borderRadius: 6,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Current Plan: Scout</div>
                    <div className="mono" style={{ fontSize: 11, marginTop: 4 }}>Free tier · 5 missions/month</div>
                  </div>
                  <a href="/upgrade" className="btn btn-accent">
                    Upgrade Plan
                  </a>
                </div>
              </div>

              <div style={{ fontSize: 14, marginBottom: 16 }}>Payment Method</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "var(--paper-2)", borderRadius: 6, marginBottom: 24 }}>
                <Ic name="credit-card" size={20} color="var(--ink-3)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>No payment method on file</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Upgrade to add a payment method</div>
                </div>
                <button className="btn btn-soft btn-sm">Add Card</button>
              </div>

              <div style={{ fontSize: 14, marginBottom: 16 }}>Billing History</div>
              <div style={{ textAlign: "center", padding: 40, color: "var(--ink-3)" }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                  <Ic name="file" size={24} />
                </div>
                <div>No billing history yet</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashShell>
  );
}