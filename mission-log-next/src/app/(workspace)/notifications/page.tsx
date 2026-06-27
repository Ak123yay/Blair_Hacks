"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Ic } from "@/components/icons/Ic";
import { getMissions } from "@/lib/storage";
import { MissionLog } from "@/types/mission";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  missionId?: string;
}

function buildNotifications(missions: MissionLog[]): Notification[] {
  const notifications: Notification[] = [];

  missions.forEach((mission) => {
    notifications.push({
      id: `created-${mission.id}`,
      type: "mission",
      title: "Mission created",
      message: `"${mission.title}" was generated in ${mission.missionMode} mode`,
      time: mission.createdAt,
      icon: "rocket",
      missionId: mission.id,
    });

    mission.taskAssignments?.forEach((task) => {
      if (task.priority === "CRITICAL") {
        notifications.push({
          id: `task-${mission.id}-${task.task.slice(0, 20)}`,
          type: "task",
          title: "Critical task assigned",
          message: `"${task.task}" in ${mission.title} - assigned to ${task.assignee}`,
          time: mission.createdAt,
          icon: "target",
          missionId: mission.id,
        });
      }
    });

    mission.systemAnomalies?.forEach((anomaly) => {
      if (anomaly.severity === "CRITICAL" || anomaly.severity === "HIGH") {
        notifications.push({
          id: `anomaly-${mission.id}-${anomaly.problem.slice(0, 20)}`,
          type: "anomaly",
          title: `${anomaly.severity} anomaly detected`,
          message: `"${anomaly.problem}" in ${mission.title}`,
          time: mission.createdAt,
          icon: "alert-triangle",
          missionId: mission.id,
        });
      }
    });
  });

  return notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

export default function NotificationsPage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const storedRead = localStorage.getItem("missionlog_read_notifs");
    return storedRead ? new Set(JSON.parse(storedRead)) : new Set();
  });
  const [now] = useState(() => Date.now());

  useEffect(() => {
    getMissions().then((data) => {
      setMissions(data);
      setNotifications(buildNotifications(data));
    });
  }, []);

  const markAsRead = (id: string) => {
    const nextRead = new Set(readIds);
    nextRead.add(id);
    setReadIds(nextRead);
    localStorage.setItem("missionlog_read_notifs", JSON.stringify([...nextRead]));
  };

  const markAllRead = () => {
    const nextRead = new Set(notifications.map((notification) => notification.id));
    setReadIds(nextRead);
    localStorage.setItem("missionlog_read_notifs", JSON.stringify([...nextRead]));
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !readIds.has(notification.id);
    if (filter === "read") return readIds.has(notification.id);
    return true;
  });

  const unreadCount = notifications.filter((notification) => !readIds.has(notification.id)).length;
  const iconColors: Record<string, string> = {
    mission: "var(--accent)",
    task: "var(--info)",
    anomaly: "oklch(0.55 0.15 25)",
  };

  const formatTime = (time: string) => {
    const diff = now - new Date(time).getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const weekMissions = missions.filter((mission) => now - new Date(mission.createdAt).getTime() < 7 * 86400000);
  const weekTasks = weekMissions.reduce((sum, mission) => sum + (mission.taskAssignments?.length || 0), 0);
  const weekAnomalies = weekMissions.reduce((sum, mission) => sum + (mission.systemAnomalies?.length || 0), 0);

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Activity</div>
        <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>Notifications</h1>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["all", "unread", "read"].map((item) => (
          <button key={item} className={`chip${filter === item ? " chip-active" : ""}`} onClick={() => setFilter(item)}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      <div className="workspace-two-col">
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="mono">{unreadCount} unread</div>
            {unreadCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all as read</button>
            )}
          </div>

          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--ink-3)" }}>
              <div style={{ marginBottom: 12 }}><Ic name="inbox" size={24} /></div>
              <div>No notifications yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filteredNotifications.map((notification) => {
                const isUnread = !readIds.has(notification.id);
                return (
                  <Link
                    key={notification.id}
                    href={notification.missionId ? `/mission/${notification.missionId}` : "/notifications"}
                    onClick={() => markAsRead(notification.id)}
                    style={{ display: "flex", gap: 14, padding: 16, borderBottom: "1px solid var(--rule-2)", background: isUnread ? "var(--paper-2)" : "transparent", cursor: "pointer", textDecoration: "none", color: "inherit", transition: "background 0.12s" }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${iconColors[notification.type] || "var(--accent)"}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Ic name={notification.icon} size={16} color={iconColors[notification.type] || "var(--accent)"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{notification.title}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>{notification.message}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 6 }}>{formatTime(notification.time)}</div>
                    </div>
                    {isUnread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 4 }} />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="mono" style={{ marginBottom: 16 }}>This Week</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13 }}>Missions created</span>
              <span className="mono">{weekMissions.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13 }}>Tasks assigned</span>
              <span className="mono">{weekTasks}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13 }}>Anomalies found</span>
              <span className="mono">{weekAnomalies}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
