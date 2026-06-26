"use client";

import { ReactNode } from "react";
import { Ic } from "./icons/Ic";

interface StyleSectionProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function StyleSection({ label, hint, children }: StyleSectionProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
        <div className="mono">{label}</div>
        {hint && (
          <div style={{ fontSize: 12, color: "var(--ink-4)", fontStyle: "italic", fontFamily: "var(--ui)" }}>
            {hint}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

interface StepIndicatorProps {
  current: number;
  steps: string[];
}

export function StepIndicator({ current, steps }: StepIndicatorProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center", marginBottom: 56 }}>
      {steps.map((s, i) => (
        <>
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: i < current ? "var(--ink)" : i === current ? "var(--accent)" : "var(--paper)",
                border: `1px solid ${i <= current ? "transparent" : "var(--rule)"}`,
                color: i <= current ? "white" : "var(--ink-4)",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--mono)",
              }}
            >
              {i < current ? <Ic name="check" size={12} color="white" /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 12.5,
                color: i === current ? "var(--ink)" : "var(--ink-3)",
                fontWeight: i === current ? 500 : 400,
              }}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && <div style={{ width: 36, height: 1, background: "var(--rule)", margin: "0 18px" }} />}
        </>
      ))}
    </div>
  );
}

interface BizMonogramProps {
  name: string;
  color: string;
  textColor?: string;
  size?: number;
  radius?: number;
}

export function BizMonogram({ name, color, textColor = "#fff", size = 64, radius = 3 }: BizMonogramProps) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: color,
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        fontFamily: "var(--serif)",
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}