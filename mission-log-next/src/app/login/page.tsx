"use client";

import { useState } from "react";
import { Ic } from "@/components/icons/Ic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* LEFT - FORM */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ maxWidth: 420, width: "100%" }}>
          <a href="/" className="missionlog-logo" style={{ marginBottom: 32, display: "inline-flex" }}>
            <div className="missionlog-logo-mark" />
            Mission<span className="serif-italic">Log</span>
          </a>

          <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: "0 0 8px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 32 }}>
            Sign in to access your mission logs
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <input type="checkbox" style={{ accentColor: "var(--accent)" }} />
                Remember me
              </label>
              <a href="/forgot-password" style={{ fontSize: 13, color: "var(--accent-ink)" }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-accent btn-lg"
              style={{ width: "100%" }}
            >
              {isLoading ? (
                <>
                  <Ic name="refresh" size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--ink-3)" }}>
            Don&apos;t have an account?{" "}
            <a href="/signup" style={{ color: "var(--accent-ink)", fontWeight: 500 }}>
              Sign up
            </a>
          </div>

          <div style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid var(--rule-2)" }}>
            <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 12 }}>
              <Ic name="globe" size={16} />
              Continue with Google
            </button>
            <button className="btn btn-ghost" style={{ width: "100%" }}>
              <Ic name="terminal" size={16} />
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT - VISUAL */}
      <div
        style={{
          width: 520,
          background: "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "var(--accent)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -100,
              left: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "var(--cosmic)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div style={{ position: "relative", textAlign: "center", color: "var(--paper)" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Ic name="rocket" size={36} color="white" />
          </div>
          <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: "0 0 12px" }}>
            Mission Control Awaits
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink-4)", maxWidth: 360 }}>
            Access your engineering notebooks, track team progress, and prepare for competition success.
          </p>
        </div>
      </div>
    </div>
  );
}