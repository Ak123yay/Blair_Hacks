"use client";

import { useState, useEffect } from "react";
import MissionCard from "@/components/MissionCard";
import { MissionLog } from "@/types/mission";
import { getMissionsLocal, deleteMission as removeMission, getUniqueProjectsLocal } from "@/lib/storage";
import { Ic } from "@/components/icons/Ic";
import DashShell from "@/components/DashShell";

export default function DashboardPage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  useEffect(() => {
    const data = getMissionsLocal();
    setMissions(data);
    const uniqueProjects = getUniqueProjectsLocal();
    setProjects(uniqueProjects);
  }, []);

  const handleDelete = (id: string) => {
    removeMission(id);
    const data = getMissionsLocal();
    setMissions(data);
    const uniqueProjects = getUniqueProjectsLocal();
    setProjects(uniqueProjects);
  };

  const filtered = missions.filter((m) => {
    const matchesSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.summary?.toLowerCase().includes(search.toLowerCase()) ||
      m.projectName?.toLowerCase().includes(search.toLowerCase());
    const matchesProject =
      !projectFilter ||
      m.projectName?.toLowerCase() === projectFilter.toLowerCase();
    return matchesSearch && matchesProject;
  });

  return (
    <DashShell>
      <div className="fadein-up">
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Flight Dashboard</div>
            <h1 className="serif" style={{ fontSize: 40, fontWeight: 400, margin: 0 }}>
              {missions.length} {missions.length === 1 ? "Mission" : "Missions"}
              <span style={{ color: "var(--ink-3)" }}> · {missions.filter((m) => m.missionMode === "vex").length} VEX · {missions.filter((m) => m.missionMode === "hackathon").length} Hackathon</span>
            </h1>
          </div>
        </div>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}>
              <Ic name="search" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search missions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 44 }}
            />
          </div>
          {projects.length > 0 && (
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="input"
              style={{ width: "auto", minWidth: 180 }}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--paper-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Ic name="inbox" size={24} color="var(--ink-3)" />
            </div>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>No missions found</h3>
            <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 8 }}>
              {missions.length === 0
                ? "Create your first mission to get started."
                : "Try a different search or filter."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
            {filtered.map((m) => (
              <MissionCard key={m.id} mission={m} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </DashShell>
  );
}