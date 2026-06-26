import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MissionLog — AI Engineering Notebook",
  description:
    "Turn messy team meetings into organized engineering logs, task lists, and judge-ready progress summaries for robotics and hackathon teams.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h1 className="serif" style={{ fontSize: 48, margin: "0 0 16px" }}>
            MissionLog Landing Page
          </h1>
          <p style={{ fontSize: 18, color: "var(--ink-3)", maxWidth: 600, margin: "0 auto 32px" }}>
            Turn messy team meetings into organized engineering logs with AI.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a href="/signup" className="btn btn-accent btn-lg">
              Get Started Free
            </a>
            <a href="/login" className="btn btn-ghost btn-lg">
              Sign In
            </a>
          </div>
        </div>
      </main>
      <footer style={{ borderTop: "1px solid var(--rule-2)", padding: "24px", textAlign: "center", fontSize: 11.5, color: "var(--ink-4)", fontFamily: "var(--mono)" }}>
        MissionLog — AI Engineering Notebook for Robotics & Hackathon Teams
      </footer>
    </>
  );
}