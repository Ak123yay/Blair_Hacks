"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ic } from "./icons/Ic";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/new", label: "New Mission", icon: "plus" },
  { href: "/dashboard", label: "Dashboard", icon: "sites" },
  { href: "/timeline", label: "Timeline", icon: "clock" },
  { href: "/analytics", label: "Analytics", icon: "chart" },
  { href: "/team", label: "Team", icon: "users" },
  { href: "/help", label: "Help", icon: "help" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <nav className="nav">
      <Link href="/" className="missionlog-logo">
        <div className="missionlog-logo-mark" />
        Mission<span className="serif-italic">Log</span>
      </Link>

      <div className="nav-links">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: isActive ? "var(--ink)" : "var(--ink-3)",
                fontWeight: isActive ? 500 : 400,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ic name={item.icon} size={14} color={isActive ? "var(--ink)" : "var(--ink-3)"} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
        {user && (
          <>
            <div style={{ width: 1, height: 20, background: "var(--rule)", margin: "0 8px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{user.email}</div>
              <button
                onClick={signOut}
                className="btn btn-ghost"
                style={{ padding: "6px 12px", fontSize: 12.5 }}
              >
                <Ic name="logout" size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}