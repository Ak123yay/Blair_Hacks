"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/icons/Ic";
import { getMissions, deleteMission } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [defaultMode, setDefaultMode] = useState(() => {
    if (typeof window === "undefined") return "standard";
    const prefs = localStorage.getItem("missionlog_prefs");
    return prefs ? JSON.parse(prefs).defaultMode || "standard" : "standard";
  });
  const [teamName, setTeamName] = useState(() => {
    if (typeof window === "undefined") return "";
    const prefs = localStorage.getItem("missionlog_prefs");
    return prefs ? JSON.parse(prefs).teamName || "" : "";
  });
  const [profileName, setProfileName] = useState(() => {
    if (typeof window === "undefined") return "";
    const prefs = localStorage.getItem("missionlog_prefs");
    return prefs ? JSON.parse(prefs).profileName || "" : "";
  });
  const [profileBio, setProfileBio] = useState(() => {
    if (typeof window === "undefined") return "";
    const prefs = localStorage.getItem("missionlog_prefs");
    return prefs ? JSON.parse(prefs).profileBio || "" : "";
  });
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [missionCount, setMissionCount] = useState(0);

  useEffect(() => {
    getMissions().then((m) => setMissionCount(m.length));
  }, []);

  const displayProfileName = profileName || user?.email?.split("@")[0] || "User";

  const savePrefs = (updates: Record<string, string>) => {
    const prefs = JSON.parse(localStorage.getItem("missionlog_prefs") || "{}");
    Object.assign(prefs, updates);
    localStorage.setItem("missionlog_prefs", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportJSON = async () => {
    const missions = await getMissions();
    const blob = new Blob([JSON.stringify(missions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `missionlog-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = async () => {
    const missions = await getMissions();
    let md = "# MissionLog Export\n\n";
    missions.forEach((m) => {
      md += `## ${m.title}\n`;
      md += `- **Mode:** ${m.missionMode}\n`;
      md += `- **Date:** ${m.date}\n`;
      md += `- **Project:** ${m.projectName || "N/A"}\n\n`;
      if (m.summary) md += `### Summary\n${m.summary}\n\n`;
      if (m.engineeringNotebookEntry) md += `### Engineering Notebook\n${m.engineeringNotebookEntry}\n\n`;
      if (m.taskAssignments?.length) {
        md += `### Tasks\n`;
        m.taskAssignments.forEach((t) => {
          md += `- [${t.status === "COMPLETED" ? "x" : " "}] ${t.task} (${t.priority}) — ${t.assignee}\n`;
        });
        md += "\n";
      }
      if (m.systemAnomalies?.length) {
        md += `### Anomalies\n`;
        m.systemAnomalies.forEach((a) => {
          md += `- **${a.severity}**: ${a.problem} — ${a.suggestedFix}\n`;
        });
        md += "\n";
      }
      md += "---\n\n";
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `missionlog-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = async () => {
    const missions = await getMissions();
    for (const m of missions) {
      await deleteMission(m.id);
    }
    setConfirmDelete(false);
    setMissionCount(0);
  };

  const tabs = [
    { id: "general", label: "General", icon: "cog" },
    { id: "profile", label: "Profile", icon: "user" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "data", label: "Data & Export", icon: "database" },
  ];

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Configuration</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>Settings</h1>
      </div>

      {saved && (
        <div style={{ padding: "10px 16px", marginBottom: 16, background: "oklch(0.92 0.04 145)", border: "1px solid oklch(0.85 0.08 145)", borderRadius: 3, fontSize: 13, color: "var(--leaf)" }}>
          <Ic name="check" size={13} /> Settings saved
        </div>
      )}

      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`sidebar-link${activeTab === tab.id ? " active" : ""}`} style={{ justifyContent: "flex-start", textAlign: "left" }}>
              <Ic name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: 640 }}>
          {activeTab === "general" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>General Settings</h2>
              <div style={{ marginBottom: 24 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>Default Mission Mode</label>
                <select className="input" value={defaultMode} onChange={(e) => { setDefaultMode(e.target.value); savePrefs({ defaultMode: e.target.value }); }}>
                  <option value="standard">Standard</option>
                  <option value="vex">VEX Robotics</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="startup">Startup</option>
                  <option value="research">Research Lab</option>
                  <option value="freelance">Freelance</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>Team Name</label>
                <input type="text" className="input" value={teamName} onChange={(e) => setTeamName(e.target.value)} onBlur={() => savePrefs({ teamName })} placeholder="Your team name" />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
                  <span style={{ fontSize: 14 }}>Enable AI suggestions for task assignments</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Profile Settings</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 32, fontFamily: "var(--serif)" }}>
                  {displayProfileName[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{displayProfileName}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>Full Name</label>
                <input type="text" className="input" value={profileName} onChange={(e) => setProfileName(e.target.value)} onBlur={() => savePrefs({ profileName })} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>Email</label>
                <input type="email" className="input" value={user?.email || ""} disabled style={{ opacity: 0.6 }} />
                <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>Email is managed by your auth provider</div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="mono" style={{ display: "block", marginBottom: 8 }}>Bio</label>
                <textarea className="input" rows={4} value={profileBio} onChange={(e) => setProfileBio(e.target.value)} onBlur={() => savePrefs({ profileBio })} placeholder="Tell us about yourself..." />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Notification Preferences</h2>
              {[
                { label: "Email notifications for task assignments", key: "emailTasks" },
                { label: "Email digest of weekly activity", key: "emailDigest" },
                { label: "Push notifications for mission reminders", key: "pushReminders" },
                { label: "Notification when team member comments", key: "pushComments" },
                { label: "Product updates and announcements", key: "emailUpdates" },
              ].map((item) => (
                <label key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--rule-2)" }}>
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
                </label>
              ))}
            </div>
          )}

          {activeTab === "data" && (
            <div className="card" style={{ padding: 24 }}>
              <h2 className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Data & Export</h2>
              <div style={{ marginBottom: 12, fontSize: 13, color: "var(--ink-3)" }}>
                You have <strong>{missionCount}</strong> mission{missionCount !== 1 ? "s" : ""} stored.
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, marginBottom: 8 }}>Export All Data</div>
                <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12 }}>Download all your mission logs in JSON format.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-soft" onClick={handleExportJSON}>
                    <Ic name="download" size={14} /> Export JSON
                  </button>
                  <button className="btn btn-soft" onClick={handleExportMarkdown}>
                    <Ic name="download" size={14} /> Export Markdown
                  </button>
                </div>
              </div>
              <div style={{ paddingTop: 24, borderTop: "1px solid var(--rule-2)" }}>
                <div style={{ fontSize: 14, marginBottom: 8, color: "oklch(0.55 0.15 25)" }}>Danger Zone</div>
                <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12 }}>Once you delete your data, there is no going back.</p>
                {confirmDelete ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "oklch(0.55 0.15 25)" }}>Are you sure?</span>
                    <button className="btn btn-sm" style={{ borderColor: "oklch(0.55 0.15 25)", color: "oklch(0.55 0.15 25)" }} onClick={handleDeleteAll}>
                      Yes, delete all
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn" style={{ borderColor: "oklch(0.55 0.15 25)", color: "oklch(0.55 0.15 25)" }} onClick={() => setConfirmDelete(true)}>
                    <Ic name="trash" size={14} /> Delete All Data
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
