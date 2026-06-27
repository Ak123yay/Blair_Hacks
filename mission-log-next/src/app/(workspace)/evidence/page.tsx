"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Ic } from "@/components/icons/Ic";
import { getEvidenceVault } from "@/lib/mission-derived";
import { getMissions } from "@/lib/storage";
import { EvidenceItem, MissionLog } from "@/types/mission";

type EvidenceRow = EvidenceItem & {
  missionId: string;
  missionTitle: string;
  projectName: string;
};

export default function EvidencePage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  const evidence = missions.flatMap((mission): EvidenceRow[] =>
    getEvidenceVault(mission).map((item) => ({
      ...item,
      missionId: mission.id,
      missionTitle: mission.title,
      projectName: mission.projectName || "Unassigned project",
    })),
  );
  const needed = evidence.filter((item) => item.status === "NEEDED").length;
  const mentioned = evidence.filter((item) => item.status === "MENTIONED").length;

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Evidence Vault</div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>
          Proof for the <span className="serif-italic">engineering story</span>
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 12, maxWidth: 660, lineHeight: 1.65 }}>
          MissionLog tags proof the team mentioned or still needs: robot photos,
          code screenshots, CAD, trial data, videos, commits, and notebook evidence.
        </p>
      </div>

      <div className="mission-control-grid" style={{ marginBottom: 22 }}>
        {[
          { label: "Evidence Items", value: evidence.length, icon: "image" },
          { label: "Needed", value: needed, icon: "alert-triangle" },
          { label: "Mentioned", value: mentioned, icon: "file" },
          { label: "Projects", value: new Set(evidence.map((item) => item.projectName)).size, icon: "folder" },
        ].map((stat) => (
          <div className="card mission-control-card" key={stat.label}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span className="mono">{stat.label}</span>
              <Ic name={stat.icon} size={16} color="var(--accent-ink)" />
            </div>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      {evidence.length === 0 ? (
        <div className="card" style={{ padding: 56, textAlign: "center" }}>
          <Ic name="image" size={30} color="var(--ink-3)" />
          <h2 className="serif" style={{ margin: "14px 0 0", fontSize: 26, fontWeight: 500 }}>No evidence yet</h2>
          <p style={{ color: "var(--ink-3)", fontSize: 13.5 }}>Create a mission and MissionLog will identify proof gaps.</p>
          <Link href="/new" className="btn btn-accent" style={{ marginTop: 18 }}>Create Mission</Link>
        </div>
      ) : (
        <div className="evidence-grid">
          {evidence.map((item) => (
            <Link
              className="card-soft evidence-item"
              href={`/mission/${item.missionId}`}
              key={`${item.missionId}-${item.description}`}
            >
              <span className={item.status === "NEEDED" ? "badge badge-warn" : "badge badge-accent"}>{item.status}</span>
              <h4>{item.type}</h4>
              <p>{item.description}</p>
              <small>{item.projectName} - {item.missionTitle}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
