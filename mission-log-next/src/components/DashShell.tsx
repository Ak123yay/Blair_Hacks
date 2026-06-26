"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ic } from "./icons/Ic";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface DashShellProps {
  children: ReactNode;
  missionId?: string;
}

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Flight Dashboard", icon: "sites" },
  { href: "/timeline", label: "Mission Timeline", icon: "clock" },
  { href: "/analytics", label: "Analytics", icon: "chart" },
  { href: "/team", label: "Crew & Team", icon: "users" },
  { href: "/notifications", label: "Notifications", icon: "bell" },
];

const settingsNav: NavItem[] = [
  { href: "/settings", label: "Settings", icon: "cog" },
  { href: "/help", label: "Help Center", icon: "book" },
  { href: "/changelog", label: "Changelog", icon: "history" },
  { href: "/upgrade", label: "Upgrade", icon: "star" },
];

export default function DashShell({ children, missionId }: DashShellProps) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ marginBottom: 24 }}>
          <Link href="/" className="missionlog-logo" style={{ fontSize: 17 }}>
            <div className="missionlog-logo-mark" style={{ width: 18, height: 18 }} />
            Mission<span className="serif-italic">Log</span>
          </Link>
        </div>

        <div className="eyebrow" style={{ marginBottom: 12, fontSize: 9 }}>Mission Control</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
          {mainNav.map((item) => {
            const isActive = pathname === item.href || (missionId && item.href.includes(missionId));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${isActive ? " active" : ""}`}
              >
                <Ic name={item.icon} size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="eyebrow" style={{ marginBottom: 12, fontSize: 9 }}>Configuration</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {settingsNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${isActive ? " active" : ""}`}
              >
                <Ic name={item.icon} size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--rule-2)" }}>
          <div className="card-soft" style={{ padding: 14, background: "var(--accent-softer)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic name="rocket" size={16} color="white" />
              </div>
              <div>
                <div className="serif" style={{ fontSize: 13, fontWeight: 500 }}>Pro Plan</div>
                <div className="mono" style={{ fontSize: 9 }}>Unlock all features</div>
              </div>
            </div>
            <a href="/upgrade" className="btn btn-accent btn-sm" style={{ width: "100%" }}>
              Upgrade Now
            </a>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>{children}</main>
    </div>
  );
}