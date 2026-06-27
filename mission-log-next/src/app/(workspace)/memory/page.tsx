"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Ic } from "@/components/icons/Ic";
import { getDesignMemory } from "@/lib/mission-derived";
import { getMissions } from "@/lib/storage";
import { DesignMemoryEntry, MissionLog } from "@/types/mission";

type MemoryRow = DesignMemoryEntry & {
  missionId: string;
  missionTitle: string;
  projectName: string;
};

export default function DesignMemoryPage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  const memories = missions.flatMap((mission): MemoryRow[] =>
    getDesignMemory(mission).map((memory) => ({
      ...memory,
      missionId: mission.id,
      missionTitle: mission.title,
      projectName: mission.projectName || "Unassigned project",
    })),
  );

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    if (!normalized) return memories;
    return memories.filter(
      (memory) =>
        memory.question.toLowerCase().includes(normalized) ||
        memory.answer.toLowerCase().includes(normalized) ||
        memory.projectName.toLowerCase().includes(normalized),
    );
  }, [memories, query]);

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Design Memory</div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>
          Ask why the team <span className="serif-italic">changed direction</span>
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 12, maxWidth: 680, lineHeight: 1.65 }}>
          This is the product&apos;s memory layer. MissionLog turns decisions into
          searchable answers with citations back to the exact mission.
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}>
          <Ic name="search" size={16} />
        </div>
        <input
          className="input"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask: why did we switch drive strategy, change an API, or choose a mechanism?"
          style={{ paddingLeft: 44 }}
          value={query}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 56, textAlign: "center" }}>
          <Ic name="database" size={30} color="var(--ink-3)" />
          <h2 className="serif" style={{ margin: "14px 0 0", fontSize: 26, fontWeight: 500 }}>No design memory yet</h2>
          <p style={{ color: "var(--ink-3)", fontSize: 13.5 }}>Create missions with design decisions to build memory.</p>
          <Link href="/new" className="btn btn-accent" style={{ marginTop: 18 }}>Create Mission</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((memory) => (
            <Link className="card hover-lift" href={`/mission/${memory.missionId}`} key={`${memory.missionId}-${memory.question}`} style={{ padding: 20 }}>
              <p className="mono" style={{ margin: "0 0 8px" }}>{memory.projectName} - {memory.missionTitle}</p>
              <h2 style={{ fontSize: 16, margin: 0 }}>{memory.question}</h2>
              <p style={{ color: "var(--ink-3)", fontSize: 14, lineHeight: 1.6, margin: "10px 0 0" }}>{memory.answer}</p>
              <p className="mono" style={{ fontSize: 9, marginTop: 10 }}>Cites: {memory.citations.join(", ")}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
