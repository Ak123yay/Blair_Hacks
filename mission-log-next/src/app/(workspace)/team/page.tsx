"use client";

import DashShell from "@/components/DashShell";
import { Ic } from "@/components/icons/Ic";

const teamMembers = [
  { name: "Alex Johnson", role: "Team Captain", email: "alex@example.com", missions: 12, avatar: "A", status: "online" },
  { name: "Jordan Smith", role: "Lead Programmer", email: "jordan@example.com", missions: 8, avatar: "J", status: "online" },
  { name: "Sam Chen", role: "Build Lead", email: "sam@example.com", missions: 10, avatar: "S", status: "away" },
  { name: "Taylor Brown", role: "Driver", email: "taylor@example.com", missions: 5, avatar: "T", status: "offline" },
  { name: "Casey Wilson", role: "Scout", email: "casey@example.com", missions: 3, avatar: "C", status: "offline" },
];

const invitations = [
  { email: "mentor@example.com", sent: "2 days ago", role: "Viewer" },
  { email: "rookie@example.com", sent: "1 week ago", role: "Member" },
];

const roles = ["Admin", "Member", "Viewer"];

export default function TeamPage() {
  return (
    <DashShell>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Collaboration</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Crew & <span className="serif-italic">Team</span>
        </h1>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="mono" style={{ marginBottom: 8 }}>Team Members</div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 500 }}>{teamMembers.length}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="mono" style={{ marginBottom: 8 }}>Active Now</div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 500 }}>
            {teamMembers.filter((m) => m.status === "online").length}
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="mono" style={{ marginBottom: 8 }}>Pending Invites</div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 500 }}>{invitations.length}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* TEAM MEMBERS */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="mono">Team Members</div>
            <button className="btn btn-accent btn-sm">
              <Ic name="plus" size={14} />
              Invite Member
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {teamMembers.map((member) => (
              <div
                key={member.email}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 14,
                  background: "var(--paper-2)",
                  borderRadius: 6,
                }}
              >
                <div style={{ position: "relative", marginRight: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 18,
                      fontFamily: "var(--serif)",
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: member.status === "online" ? "var(--leaf)" : member.status === "away" ? "var(--warn)" : "var(--ink-4)",
                      border: "2px solid var(--paper)",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{member.name}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                    {member.role} · {member.missions} missions
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm">
                    <Ic name="mail" size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Ic name="more-vertical" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INVITATIONS & ROLES */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* PENDING INVITES */}
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ marginBottom: 16 }}>Pending Invitations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {invitations.map((inv) => (
                <div key={inv.email} style={{ padding: 12, background: "var(--paper-2)", borderRadius: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{inv.email}</div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-3)", marginTop: 4 }}>
                    {inv.role} · Sent {inv.sent}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button className="btn btn-soft btn-sm" style={{ flex: 1 }}>Resend</button>
                    <button className="btn btn-ghost btn-sm">
                      <Ic name="x" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROLE PERMISSIONS */}
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ marginBottom: 16 }}>Role Permissions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {roles.map((role) => (
                <div key={role} style={{ padding: 12, background: "var(--paper-2)", borderRadius: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{role}</div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--ink-3)" }}>
                    {role === "Admin" && "Full access to all missions, settings, and team management"}
                    {role === "Member" && "Can create missions, view team data, and comment"}
                    {role === "Viewer" && "Read-only access to shared missions"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY FEED */}
      <div className="card" style={{ padding: 24, marginTop: 20 }}>
        <div className="mono" style={{ marginBottom: 16 }}>Team Activity</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { user: "Alex Johnson", action: "created mission", target: "Autonomous Path Tuning", time: "2 hours ago" },
            { user: "Jordan Smith", action: "completed task", target: "PID Controller Tuning", time: "5 hours ago" },
            { user: "Sam Chen", action: "commented on", target: "Drive Train Design", time: "1 day ago" },
            { user: "Taylor Brown", action: "joined the team", target: "", time: "2 days ago" },
          ].map((activity, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--rule-2)" : "none" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-ink)",
                  fontSize: 12,
                  fontFamily: "var(--serif)",
                  fontWeight: 600,
                }}
              >
                {activity.user.charAt(0)}
              </div>
              <div style={{ flex: 1, fontSize: 13 }}>
                <span style={{ fontWeight: 500 }}>{activity.user}</span>{" "}
                <span style={{ color: "var(--ink-3)" }}>{activity.action}</span>{" "}
                {activity.target && <span style={{ fontWeight: 500 }}>{activity.target}</span>}
              </div>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashShell>
  );
}