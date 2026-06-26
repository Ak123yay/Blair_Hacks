"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MissionResults from "@/components/MissionResults";
import { MissionLog } from "@/types/mission";
import { getMission } from "@/lib/storage";
import { Ic } from "@/components/icons/Ic";

export default function MissionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [mission, setMission] = useState<MissionLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    getMission(id).then((m) => {
      setMission(m || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }} className="fadein-up">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--paper-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Ic name="rocket" size={28} color="var(--ink-3)" />
        </div>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: 0 }}>Loading mission...</h2>
      </div>
    );
  }

  if (!mission) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }} className="fadein-up">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--paper-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Ic name="rocket" size={28} color="var(--ink-3)" />
        </div>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: 0 }}>Mission not found</h2>
        <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 8 }}>This mission doesn&apos;t exist or was deleted.</p>
        <a href="/dashboard" className="btn btn-soft" style={{ marginTop: 20 }}>
          <Ic name="arrow-l" size={13} />
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 24 }}>
        <a
          href="/dashboard"
          style={{ fontSize: 12, color: "var(--ink-3)", display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          <Ic name="arrow-l" size={12} />
          All missions
        </a>
      </div>
      <MissionResults mission={mission} onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}