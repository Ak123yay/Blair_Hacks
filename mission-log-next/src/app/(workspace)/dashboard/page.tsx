"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MissionCard from "@/components/MissionCard";
import { Ic } from "@/components/icons/Ic";
import { getEvidenceVault, getJudgeReadinessScore } from "@/lib/mission-derived";
import { deleteMission as removeMission, getMissions, getUniqueProjects } from "@/lib/storage";
import { MissionLog } from "@/types/mission";

export default function DashboardPage() {
  const [missions, setMissions] = useState<MissionLog[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const loadData = async () => {
    const data = await getMissions();
    setMissions(data);
    setProjects(await getUniqueProjects());
  };

  useEffect(() => {
    getMissions().then(setMissions);
    getUniqueProjects().then(setProjects);
  }, []);

  const handleDelete = async (id: string) => {
    await removeMission(id);
    await loadData();
  };

  const filtered = missions.filter((mission) => {
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      mission.title.toLowerCase().includes(query) ||
      mission.summary?.toLowerCase().includes(query) ||
      mission.projectName?.toLowerCase().includes(query);
    const matchesProject =
      !projectFilter ||
      mission.projectName?.toLowerCase() === projectFilter.toLowerCase();
    return matchesSearch && matchesProject;
  });

  const openObjectives = missions.reduce(
    (sum, mission) =>
      sum + (mission.taskAssignments?.filter((task) => task.status !== "COMPLETED").length || 0),
    0,
  );
  const decisionCount = missions.reduce(
    (sum, mission) => sum + (mission.commandDecisions?.length || 0),
    0,
  );
  const missingEvidence = missions.reduce(
    (sum, mission) =>
      sum + getEvidenceVault(mission).filter((item) => item.status !== "UPLOADED").length,
    0,
  );
  const readinessScore = missions.length
    ? Math.round(missions.reduce((sum, mission) => sum + getJudgeReadinessScore(mission), 0) / missions.length)
    : 0;
  const activeTeam = missions.find((mission) => mission.teamName)?.teamName || "VEX Robotics 1234A";

  return (
    <div className="fadein-up">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>MissionLog Home</div>
          <h1 className="serif" style={{ fontSize: 36, fontWeight: 400, margin: 0 }}>
            Mission Control
          </h1>
          <p style={{ color: "var(--ink-3)", fontSize: 14.5, lineHeight: 1.6, maxWidth: 620, margin: "10px 0 0" }}>
            {activeTeam} has {missions.length} saved {missions.length === 1 ? "mission" : "missions"}. Start with a meeting, then review memory, evidence, and judge prep.
          </p>
        </div>
        <Link className="btn btn-accent" href="/new" style={{ flexShrink: 0 }}>
          <Ic name="plus" size={14} color="white" />
          New Mission
        </Link>
      </div>

      <div className="dashboard-action-grid">
        {[
          { href: "/new", label: "Create a mission", desc: "Paste notes or upload audio. AI turns it into a clean log.", icon: "plus" },
          { href: "/memory", label: "Ask memory", desc: "Ask why the team made a design choice and get cited answers.", icon: "database" },
          { href: "/judge", label: "Prep for judges", desc: "See likely questions, proof gaps, and readiness signals.", icon: "star" },
        ].map((item) => (
          <Link className="card hover-lift dashboard-action-card" href={item.href} key={item.href}>
            <span className="dashboard-action-icon"><Ic name={item.icon} size={16} color="var(--accent-ink)" /></span>
            <strong>{item.label}</strong>
            <p>{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mission-control-grid" style={{ marginBottom: 22 }}>
        {[
          { label: "Active Projects", value: Math.max(projects.length, missions.length ? 1 : 0), icon: "folder" },
          { label: "Open Objectives", value: openObjectives, icon: "target" },
          { label: "Recent Decisions", value: decisionCount, icon: "clipboard-check" },
          { label: "Missing Evidence", value: missingEvidence, icon: "alert-triangle" },
        ].map((stat) => (
          <div className="card mission-control-card hover-lift" key={stat.label}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span className="mono">{stat.label}</span>
              <Ic name={stat.icon} size={16} color="var(--accent-ink)" />
            </div>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 20, background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div>
            <p className="mono" style={{ color: "var(--accent-soft)", margin: 0 }}>Launch Readiness</p>
            <h2 className="serif" style={{ margin: "8px 0 0", fontSize: 34, fontWeight: 500 }}>
              {readinessScore}% judge-ready
            </h2>
          </div>
          <div style={{ minWidth: 220, flex: "0 1 360px" }}>
            <div className="agent-progress-bar" style={{ height: 8, background: "rgb(255 255 255 / 0.14)" }}>
              <div className="agent-progress-bar-fill" style={{ width: `${readinessScore}%` }} />
            </div>
            <p style={{ color: "rgb(255 255 255 / 0.68)", fontSize: 12.5, lineHeight: 1.5, margin: "10px 0 0" }}>
              Improve this score by adding test evidence, design rationale, clear owner assignments, and complete notebook sections.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}>
            <Ic name="search" size={16} />
          </div>
          <input
            type="text"
            placeholder="Search missions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input"
            style={{ paddingLeft: 44 }}
          />
        </div>
        {projects.length > 0 && (
          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className="input"
            style={{ width: "auto", minWidth: 180 }}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Ic name="inbox" size={24} color="var(--ink-3)" />
          </div>
          <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>No missions found</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 8 }}>
            {missions.length === 0 ? "Create your first mission to get started." : "Try a different search or filter."}
          </p>
          {missions.length === 0 && (
            <a href="/new" className="btn btn-accent" style={{ marginTop: 20 }}>
              <Ic name="plus" size={14} /> Create Mission
            </a>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
          {filtered.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
