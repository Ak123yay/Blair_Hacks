"use client";

import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Plus,
  Sparkles,
  Clock,
  BarChart3,
  Users,
  Bell,
  Settings,
  History,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export type DashboardUser = {
  email: string;
  initial: string;
  isTrial: boolean;
  name: string;
  plan: string;
  trialDaysLeft: number;
  trialEndsAt: string | null;
};

type DashboardShellProps = {
  children: ReactNode;
  user: DashboardUser;
};

const primaryNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/new", label: "New Mission", icon: Plus, accent: true },
];

const secondaryNav = [
  { href: "/team", label: "Team", icon: Users },
  { href: "/notifications", label: "Activity", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
  { href: "/changelog", label: "Changelog", icon: History },
  { href: "/upgrade", label: "Upgrade", icon: Star },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}

function planLabel(user: DashboardUser) {
  if (user.isTrial) {
    return `${user.plan} trial`;
  }
  return user.plan;
}

function trialLabel(daysLeft: number) {
  if (daysLeft <= 0) {
    return "Trial ends today";
  }
  if (daysLeft === 1) {
    return "1 day left";
  }
  return `${daysLeft} days left`;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [trialDaysLeft, setTrialDaysLeft] = useState(user.trialDaysLeft);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user.trialEndsAt) return;

    const updateTrialDaysLeft = () => {
      setTrialDaysLeft(Math.max(0, Math.ceil((new Date(user.trialEndsAt!).getTime() - Date.now()) / 86400000)));
    };

    updateTrialDaysLeft();
    const timer = window.setInterval(updateTrialDaysLeft, 60000);
    return () => window.clearInterval(timer);
  }, [user.trialEndsAt]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();

    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="dashboard-shell paper">
      <input
        aria-label="Collapse or expand dashboard menu"
        className="dashboard-sidebar-control"
        id="dashboard-sidebar-control"
        onChange={(event) => {
          window.localStorage.setItem("missionlog-sidebar-collapsed", String(event.currentTarget.checked));
        }}
        type="checkbox"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var e=document.getElementById("dashboard-sidebar-control");if(e)e.checked=window.localStorage.getItem("missionlog-sidebar-collapsed")==="true";}catch(_){}`,
        }}
      />
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <div className="dashboard-sidebar-logo">
            <Link href="/" className="missionlog-logo" aria-label="Go to MissionLog home">
              <div className="missionlog-logo-mark" aria-hidden="true" />
              <span>Mission<span className="serif-italic">Log</span></span>
            </Link>
          </div>
          <label
            className="dashboard-sidebar-toggle"
            htmlFor="dashboard-sidebar-control"
            title="Collapse or expand menu"
          >
            <ChevronLeft aria-hidden="true" className="dashboard-sidebar-toggle-close" size={16} />
            <ChevronRight aria-hidden="true" className="dashboard-sidebar-toggle-open" size={16} />
          </label>
        </div>

        <p className="dashboard-sidebar-section-label">Mission Control</p>
        <nav className="dashboard-nav" aria-label="Dashboard">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={[
                  "dashboard-nav-link",
                  active ? "dashboard-nav-link-active" : "",
                  item.accent ? "dashboard-nav-link-accent" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={item.href}
                key={item.href}
                title={item.label}
              >
                <Icon aria-hidden="true" size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="dashboard-sidebar-section-label dashboard-sidebar-section-label-spaced">
          Configuration
        </p>
        <nav className="dashboard-nav dashboard-nav-secondary" aria-label="Settings">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={[
                  "dashboard-nav-link",
                  active ? "dashboard-nav-link-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={item.href}
                key={item.href}
                title={item.label}
              >
                <Icon aria-hidden="true" size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user.isTrial ? (
          <div className="dashboard-trial-card">
            <div className="dashboard-trial-icon" aria-hidden="true">
              <Sparkles size={16} />
            </div>
            <p className="mono">Pro trial</p>
            <h2>{trialLabel(trialDaysLeft)}</h2>
            <p>
              Keep your missions, analytics, and team collaboration after the trial ends.
            </p>
            <Link className="btn btn-accent btn-sm dashboard-trial-button" href="/upgrade">
              Upgrade
            </Link>
          </div>
        ) : null}

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-user-card">
            <span className="dashboard-user-avatar" aria-hidden="true">
              {user.initial}
            </span>
            <span className="dashboard-user-copy">
              <strong>{user.name}</strong>
              <span>{planLabel(user)}</span>
            </span>
          </div>
          <button
            className="dashboard-signout"
            disabled={isPending}
            onClick={signOut}
            title="Sign out"
            type="button"
          >
            <LogOut aria-hidden="true" size={14} />
            <span>{isPending ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-mobile-bar">
          <Link href="/" className="missionlog-logo" aria-label="Go to MissionLog home">
            <div className="missionlog-logo-mark" aria-hidden="true" />
            <span>Mission<span className="serif-italic">Log</span></span>
          </Link>
          <Link className="dashboard-mobile-new" href="/new">
            <Plus aria-hidden="true" size={14} />
            New
          </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
