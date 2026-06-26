"use client";

import { useSyncExternalStore } from "react";
import TimelineView from "@/components/TimelineView";
import { MissionLog } from "@/types/mission";
import { getMissionsLocal } from "@/lib/storage";

function useLocalStorageMissions() {
  const subscribe = (cb: () => void) => {
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  };
  const getSnapshot = () => JSON.stringify(getMissionsLocal());
  const getServerSnapshot = () => "[]";
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return JSON.parse(raw) as MissionLog[];
}

export default function TimelinePage() {
  const missions = useLocalStorageMissions();

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