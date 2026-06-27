"use client";

import { useState, useEffect } from "react";
import TimelineView from "@/components/TimelineView";
import { MissionLog } from "@/types/mission";
import { getMissions } from "@/lib/storage";

export default function TimelinePage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);

  useEffect(() => {
    getMissions().then(setMissions);
  }, []);

  return (
    <div className="fadein-up">
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Mission Timeline</div>
        <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>
          Track your <span className="serif-italic">progress</span>
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 12, maxWidth: 540 }}>
          See how your project evolved over time. Each mission is plotted chronologically with key objectives and next steps.
        </p>
      </div>
      <TimelineView missions={missions} />
    </div>
  );
}