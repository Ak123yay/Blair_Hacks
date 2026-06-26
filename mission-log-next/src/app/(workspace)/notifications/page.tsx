"use client";

import { useState } from "react";
import DashShell from "@/components/DashShell";
import { Ic } from "@/components/icons/Ic";

const notifications = [
  {
    id: 1,
    type: "task",
    title: "New task assigned",
    message: "Alex assigned you \"Calibrate intake speed\" in Autonomous Path Tuning",
    time: "5 minutes ago",
    unread: true,
    icon: "target",
  },
  {
    id: 2,
    type: "comment",
    title: "New comment on mission",
    message: "Jordan commented on Drive Train Design",
    time: "2 hours ago",
    unread: true,
    icon: "message",
  },
  {
    id: 3,
    type: "mention",
    title: "You were mentioned",
    message: "Sam mentioned you in a comment: \"@Alex can you review this?\"",
    time: "5 hours ago",
    unread: false,
    icon: "at",
  },
  {
    id: 4,
    type: "invite",
    title: "Team invitation",
    message: "You've been invited to join team \"Blair_Hacks\"",
    time: "1 day ago",
    unread: false,
    icon: "users",
  },
  {
    id: 5,
    type: "reminder",
    title: "Mission reminder",
    message: "Don't forget to document today's build session",
    time: "2 days ago",
    unread: false,
    icon: "bell",
  },
  {
    id: 6,
    type: "update",
    title: "Product update",
    message: "New VEX notebook template is now available",
    time: "3 days ago",
    unread: false,
    icon: "sparkle",
  },
];

const iconColors: Record<string, string> = {
  task: "var(--accent)",
  comment: "var(--info)",
  mention: "var(--cosmic)",
  invite: "var(--leaf)",
  reminder: "var(--warn)",
  update: "var(--accent)",
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.unread;
    if (filter === "read") return !n.unread;
    return true;
  });

  return (
    <DashShell>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Activity</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
          Notifications
        </h1>
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          className={`chip${filter === "all" ? " chip-active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`chip${filter === "unread" ? " chip-active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
        <button
          className={`chip${filter === "read" ? " chip-active" : ""}`}
          onClick={() => setFilter("read")}
        >
          Read
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* NOTIFICATIONS LIST */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="mono">
              {notifications.filter((n) => n.unread).length} unread
            </div>
            <button className="btn btn-ghost btn-sm">Mark all as read</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: 16,
                  borderBottom: "1px solid var(--rule-2)",
                  background: n.unread ? "var(--paper-2)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = n.unread ? "var(--paper-3)" : "var(--paper-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? "var(--paper-2)" : "transparent")}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: `${iconColors[n.type]}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Ic name={n.icon} size={16} color={iconColors[n.type]} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>{n.message}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 6 }}>
                    {n.time}
                  </div>
                </div>
                {n.unread && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* QUICK ACTIONS */}
          <div className="card" style={{ padding: 20 }}>
            <div className="mono" style={{ marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-soft btn-sm" style={{ justifyContent: "flex-start" }}>
                <Ic name="bell" size={14} />
                Mute all notifications
              </button>
              <button className="btn btn-soft btn-sm" style={{ justifyContent: "flex-start" }}>
                <Ic name="cog" size={14} />
                Notification settings
              </button>
              <button className="btn btn-soft btn-sm" style={{ justifyContent: "flex-start" }}>
                <Ic name="mail" size={14} />
                Email preferences
              </button>
            </div>
          </div>

          {/* ACTIVITY SUMMARY */}
          <div className="card" style={{ padding: 20 }}>
            <div className="mono" style={{ marginBottom: 16 }}>This Week</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13 }}>Tasks assigned</span>
                <span className="mono">12</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13 }}>Comments received</span>
                <span className="mono">8</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13 }}>Mentions</span>
                <span className="mono">3</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13 }}>Missions created</span>
                <span className="mono">5</span>
              </div>
            </div>
          </div>

          {/* DO NOT DISTURB */}
          <div
            className="card"
            style={{
              padding: 20,
              background: "var(--ink)",
              color: "var(--paper)",
              borderColor: "var(--ink)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Ic name="pause" size={16} color="var(--paper)" />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Do Not Disturb</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 16 }}>
              Pause all notifications for a focused work session
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "var(--accent)" }} />
              <span style={{ fontSize: 13 }}>Enable DND mode</span>
            </label>
          </div>
        </div>
      </div>
    </DashShell>
  );
}