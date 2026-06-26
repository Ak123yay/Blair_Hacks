"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ic } from "@/components/icons/Ic";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const redirectedFrom = searchParams.get("redirected_from");
        router.push(redirectedFrom || "/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: 12, background: "oklch(0.93 0.08 25)", border: "1px solid oklch(0.75 0.12 25)", borderRadius: 4, marginBottom: 16, fontSize: 13, color: "oklch(0.45 0.12 25)" }}>
          {error}
        </div>
      )}

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

      <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--ink-3)" }}>
        Don&apos;t have an account?{" "}
        <a href="/signup" style={{ color: "var(--accent-ink)", fontWeight: 500 }}>
          Sign up
        </a>
      </div>

      <div style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid var(--rule-2)" }}>
        <button type="button" onClick={handleGoogleSignIn} className="btn btn-ghost" style={{ width: "100%", marginBottom: 12 }}>
          <Ic name="globe" size={16} />
          Continue with Google
        </button>
        <button type="button" className="btn btn-ghost" style={{ width: "100%" }}>
          <Ic name="terminal" size={16} />
          Continue with GitHub
        </button>
      </div>
    </form>
  );
}

export default function LoginPage() {
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

          <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
            <LoginForm />
          </Suspense>
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