import { Ic } from "@/components/icons/Ic";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
        className="fadein-up"
      >
        <Ic name="rocket" size={36} color="var(--accent-ink)" />
      </div>
      <h1 className="serif fadein-up" style={{ fontSize: 48, fontWeight: 400, margin: 0 }}>
        404
      </h1>
      <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, margin: "16px 0", color: "var(--ink-3)" }}>
        Mission control lost
      </h2>
      <p style={{ fontSize: 14, color: "var(--ink-3)", maxWidth: 400, marginBottom: 32 }}>
        The page you&apos;re looking for has drifted into deep space. Let&apos;s get you back on course.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <a href="/" className="btn btn-accent">
          <Ic name="home" size={16} />
          Back Home
        </a>
        <a href="/dashboard" className="btn btn-soft">
          <Ic name="sites" size={16} />
          Dashboard
        </a>
      </div>
    </div>
  );
}