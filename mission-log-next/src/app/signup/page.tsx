"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ic } from "@/components/icons/Ic";
import { signUpWithEmail } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [team, setTeam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await signUpWithEmail(email, password);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* LEFT - VISUAL */}
      <div
        style={{
          width: 520,
          background: "var(--accent)",
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
              background: "var(--ink)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div style={{ position: "relative", textAlign: "center", color: "white" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Ic name="sparkle" size={36} color="white" />
          </div>
          <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: "0 0 12px" }}>
            Start Your Mission
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", maxWidth: 360 }}>
            Join hundreds of teams using MissionLog to document their journey to competition success.
          </p>

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "5 free missions to get started",
              "AI-powered documentation",
              "VEX & FIRST ready formats",
              "Export to PDF & Markdown",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic name="check" size={12} color="white" />
                </div>
                <span style={{ fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
        <div style={{ maxWidth: 420, width: "100%" }}>
          <a href="/" className="missionlog-logo" style={{ marginBottom: 32, display: "inline-flex" }}>
            <div className="missionlog-logo-mark" />
            Mission<span className="serif-italic">Log</span>
          </a>

          <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: "0 0 8px" }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 32 }}>
            Start documenting your engineering journey
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: 12, background: "oklch(0.93 0.08 25)", border: "1px solid oklch(0.75 0.12 25)", borderRadius: 4, marginBottom: 16, fontSize: 13, color: "oklch(0.45 0.12 25)" }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="input"
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
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

            <div style={{ marginBottom: 16 }}>
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
                minLength={8}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="mono" style={{ display: "block", marginBottom: 8 }}>
                Team / Organization (optional)
              </label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="e.g., Team 17392, Blair_Hacks"
                className="input"
              />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, marginBottom: 24 }}>
              <input type="checkbox" required style={{ accentColor: "var(--accent)", marginTop: 2 }} />
              <span style={{ color: "var(--ink-3)" }}>
                I agree to the{" "}
                <a href="/terms" style={{ color: "var(--accent-ink)" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" style={{ color: "var(--accent-ink)" }}>
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-accent btn-lg"
              style={{ width: "100%" }}
            >
              {isLoading ? (
                <>
                  <Ic name="refresh" size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--ink-3)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "var(--accent-ink)", fontWeight: 500 }}>
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}