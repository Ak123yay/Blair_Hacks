"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  
  // Don't show navbar on auth pages or workspace pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isWorkspacePage = pathname.startsWith("/dashboard") || 
    pathname.startsWith("/new") || 
    pathname.startsWith("/timeline") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/team") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/changelog") ||
    pathname.startsWith("/upgrade");

  if (isAuthPage || isWorkspacePage) return null;

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
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          );
        })}
        <Link href="/login" style={{ color: "var(--ink)", textDecoration: "none" }}>
          Sign in
        </Link>
        <Link href="/signup" className="btn btn-accent btn-sm">
          Start free
        </Link>
      </div>
    </nav>
  );
}