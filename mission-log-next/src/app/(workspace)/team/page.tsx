"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/icons/Ic";
import { MissionLog } from "@/types/mission";
import { getMissions } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

export default function TeamPage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<MissionLog[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [invitations, setInvitations] = useState<{ email: string; sent: string }[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("missionlog_invitations");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  const crewMembers = (() => {
    const crewMap = new Map<string, { name: string; missions: number; latestDate: string }>();
    missions.forEach((m) => {
      m.crew?.forEach((name) => {
        const existing = crewMap.get(name);
        if (existing) {
          existing.missions++;
          if (new Date(m.createdAt) > new Date(existing.latestDate)) existing.latestDate = m.createdAt;
        } else {
          crewMap.set(name, { name, missions: 1, latestDate: m.createdAt });
        }
      });
    });
    return Array.from(crewMap.values()).sort((a, b) => b.missions - a.missions);
  })();

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newInvitations = [...invitations, { email: inviteEmail, sent: "Just now" }];
    setInvitations(newInvitations);
    localStorage.setItem("missionlog_invitations", JSON.stringify(newInvitations));
    setInviteEmail("");
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  };

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Collaboration</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Crew & <span className="serif-italic">Team</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="mono" style={{ marginBottom: 8 }}>Crew Members</div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 500 }}>{crewMembers.length}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="mono" style={{ marginBottom: 8 }}>You</div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 500 }}>{user?.email?.split("@")[0] || "User"}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="mono" style={{ marginBottom: 8 }}>Pending Invites</div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 500 }}>{invitations.length}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="mono" style={{ marginBottom: 20 }}>Crew Members</div>
          {crewMembers.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--ink-3)" }}>
              <div style={{ marginBottom: 12 }}><Ic name="users" size={24} /></div>
              <div>No crew members yet. They&apos;ll appear here as you create missions.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {crewMembers.map((member) => (
                <div key={member.name} style={{ display: "flex", alignItems: "center", padding: 14, background: "var(--paper-2)", borderRadius: 6 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontFamily: "var(--serif)", marginRight: 14 }}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{member.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                      {member.missions} mission{member.missions !== 1 ? "s" : ""} · Last active {new Date(member.latestDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ marginBottom: 16 }}>Invite Member</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="email" placeholder="email@example.com" className="input" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-accent btn-sm" onClick={handleInvite}>Invite</button>
            </div>
            {inviteSent && <div style={{ fontSize: 12, color: "var(--leaf)", marginTop: 8 }}>Invitation sent!</div>}
          </div>

          {invitations.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <div className="mono" style={{ marginBottom: 16 }}>Pending Invitations</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {invitations.map((inv, i) => (
                  <div key={i} style={{ padding: 12, background: "var(--paper-2)", borderRadius: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{inv.email}</div>
                    <div className="mono" style={{ fontSize: 9, color: "var(--ink-3)", marginTop: 4 }}>Sent {inv.sent}</div>
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => {
                      const updated = invitations.filter((_, idx) => idx !== i);
                      setInvitations(updated);
                      localStorage.setItem("missionlog_invitations", JSON.stringify(updated));
                    }}>
                      <Ic name="x" size={12} /> Revoke
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
