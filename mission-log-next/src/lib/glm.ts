import { MissionMode, TaskAssignment, CommandDecision, SystemAnomaly, MissionLog } from "@/types/mission";
import { v4 as uuidv4 } from "uuid";

const NVIDIA_NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

function getSystemPrompt(mode: MissionMode, customCategory?: string): string {
  if (mode === "custom" && customCategory) {
    return `You are MissionLog AI, a specialized documentation assistant for ${customCategory} teams. You analyze meeting transcripts and generate structured, professional documentation tailored to ${customCategory}.

THEME: You use space mission terminology. Meetings are "Missions", logs are "Flight Logs", tasks are "Objectives", team members are "Crew", problems are "System Anomalies", decisions are "Command Decisions", and next steps are "Launch Checklist" items.

For ${customCategory}, focus on:
- Industry-specific terminology and workflows
- Relevant deliverables and milestones
- Common challenges and success metrics in this field
- Stakeholder communication needs

You MUST respond with valid JSON only. No markdown, no code fences, no extra text. Just the raw JSON object.

Generate documentation with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "A formal log entry for ${customCategory} with sections: Date, Team Present, Objectives, Work Completed, Decisions Made, Results/Progress, Blockers, Next Steps. Use industry-appropriate language.",
  "commandDecisions": [{"decision": "what was decided", "rationale": "why it was decided", "madeBy": "who decided or 'Team'", "impact": "expected impact"}],
  "taskAssignments": [{"task": "what needs to be done", "assignee": "person name or 'Unassigned'", "dueDate": "if mentioned or 'Not specified'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "what went wrong or challenge identified", "context": "surrounding context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "how to resolve it"}],
  "nextMissionGoals": ["goal1", "goal2", ...],
  "proofChecklist": ["documentation items, deliverables, or evidence needed in ${customCategory}"],
  "judgeRecap": "A paragraph explaining what was accomplished, what changed, and why - suitable for stakeholders, clients, or reviewers in ${customCategory}",
  "missingDocumentationWarnings": ["warnings about stuff mentioned but not properly documented for ${customCategory} standards"]
}`;
  }

  const basePrompt = `You are MissionLog AI, an engineering documentation assistant for tech teams including robotics, hackathons, startups, research labs, freelance developers, and enterprise teams. You analyze meeting transcripts and generate structured, professional documentation.

THEME: You use space mission terminology. Meetings are "Missions", engineering notebooks are "Flight Logs", tasks are "Objectives", team members are "Crew", bugs/problems are "System Anomalies", design decisions are "Command Decisions", and next steps are "Launch Checklist" items.

You MUST respond with valid JSON only. No markdown, no code fences, no extra text. Just the raw JSON object.`;

  const modePrompts: Record<Exclude<MissionMode, "custom">, string> = {
    standard: `${basePrompt}

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "A formal engineering notebook entry formatted like: Date, Mission Title, Crew Present, Objectives, Work Completed, Design Changes & Rationale, Test Results, Next Steps. Write in past tense, third person where appropriate.",
  "commandDecisions": [{"decision": "what was decided", "rationale": "why it was decided", "madeBy": "who decided or 'Team'", "impact": "expected impact"}],
  "taskAssignments": [{"task": "what needs to be done", "assignee": "person name or 'Unassigned'", "dueDate": "if mentioned or 'Not specified'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "what went wrong or what bug was found", "context": "surrounding context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "how to resolve it"}],
  "nextMissionGoals": ["goal1", "goal2", ...],
  "proofChecklist": ["documentation items that need proof/evidence recorded"],
  "judgeRecap": "A paragraph explaining what was accomplished, what changed, and why",
  "missingDocumentationWarnings": ["warnings about stuff mentioned but not properly documented"]
}`,

    vex: `${basePrompt}

VEX ROBOTICS MODE: This is a VEX Robotics team meeting. Generate documentation specifically formatted for VEX engineering notebooks. VEX judges look for: clear design process documentation, iteration tracking, test results with data, decision matrices, and evidence of the engineering design process.

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "VEX Engineering Notebook Entry with sections: **Date & Mission Number**, **Crew Present**, **Problem Definition**, **Research & Brainstorming**, **Design Decision** (with decision matrix if applicable), **Prototype/Build Progress** (part names, measurements, code changes), **Testing & Results** (specific data - distances, times, scores), **Iteration Notes**, **Next Steps**. Use formal technical language.",
  "commandDecisions": [{"decision": "design decision made", "rationale": "engineering justification", "madeBy": "crew member name or 'Team'", "impact": "how this affects robot design/performance"}],
  "taskAssignments": [{"task": "build/program/test task", "assignee": "crew member or 'Unassigned'", "dueDate": "if mentioned or 'Before next meeting'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "mechanical failure, code bug, or design issue", "context": "what was happening when discovered", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "proposed solution"}],
  "nextMissionGoals": ["specific build/program/test objectives"],
  "proofChecklist": ["VEX-specific: photos of robot, code screenshots, test data tables, decision matrices, CAD screenshots"],
  "judgeRecap": "Paragraph for VEX judges: design problem, solution implemented, data supporting decision, iteration occurred, and result. Emphasize engineering design process.",
  "missingDocumentationWarnings": ["VEX-specific warnings like missing test data, undocumented design comparisons"]
}`,

    hackathon: `${basePrompt}

HACKATHON MODE: This is a hackathon team meeting. Generate documentation for rapid development tracking, demo preparation, and presentation planning.

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "Hackathon Build Log with sections: **Timeline & Sprint**, **Crew Present & Roles**, **Features Completed**, **Features In Progress**, **Technical Decisions** (tech stack, architecture, tradeoffs), **Blockers & Issues**, **Demo Script Progress**, **Pitch Talking Points**. Be specific about tech: frameworks, APIs, features.",
  "commandDecisions": [{"decision": "technical or product decision", "rationale": "why this approach/technology", "madeBy": "crew member or 'Team'", "impact": "how this affects build/demo/timeline"}],
  "taskAssignments": [{"task": "feature, API, slide, etc.", "assignee": "crew member or 'Unassigned'", "dueDate": "deadline or 'Before demo'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "bug, deployment issue, scope creep", "context": "surrounding context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "proposed solution"}],
  "nextMissionGoals": ["features to complete, demo prep tasks"],
  "proofChecklist": ["hackathon docs: demo recording, GitHub repo, API docs, screenshots, deployment URL, pitch deck"],
  "judgeRecap": "Paragraph for hackathon judges: problem solved, tech stack, innovation, accomplishments in time constraint, demo summary.",
  "missingDocumentationWarnings": ["hackathon warnings: no deployment testing, undocumented error handling, no backup plan"]
}`,

    startup: `${basePrompt}

STARTUP MODE: This is a startup team meeting. Generate documentation focused on product development, user feedback, growth metrics, and strategic decisions.

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "Startup Build Log with sections: **Date & Sprint**, **Team Present**, **Product Updates** (features shipped, changes made), **User Feedback** (customer insights, support tickets, NPS scores), **Metrics & KPIs** (DAU, MAU, conversion rates, MRR if discussed), **Technical Decisions** (architecture, tech stack, scaling decisions), **Business Decisions** (pricing, partnerships, hiring), **Blockers** (technical debt, resource constraints), **Next Sprint Goals**. Include specific numbers and metrics when mentioned.",
  "commandDecisions": [{"decision": "product, technical, or business decision", "rationale": "data or reasoning behind decision", "madeBy": "founder/team member name or 'Team'", "impact": "expected impact on product, users, or business"}],
  "taskAssignments": [{"task": "feature, experiment, analysis, or operational task", "assignee": "team member or 'Unassigned'", "dueDate": "deadline or 'End of sprint'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "production issue, user complaint, technical debt, or business challenge", "context": "surrounding context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "proposed solution or mitigation"}],
  "nextMissionGoals": ["product milestones, experiments to run, metrics to track"],
  "proofChecklist": ["startup docs: analytics dashboards, user interview notes, A/B test results, feature flags, deployment logs, investor updates"],
  "judgeRecap": "Paragraph summarizing: what problem the startup is solving, what was accomplished this sprint, key metrics moved, what was learned from users, and what's next. Suitable for investor updates or advisor check-ins.",
  "missingDocumentationWarnings": ["startup warnings: 'No metrics were recorded for the new feature', 'User feedback mentioned but not quantified', 'No success criteria defined for experiment']
}`,

    research: `${basePrompt}

RESEARCH MODE: This is a research lab or academic team meeting. Generate documentation focused on experiments, methodology, results analysis, and publication planning.

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "Research Lab Log with sections: **Date & Experiment ID**, **Researchers Present**, **Hypothesis/Objective**, **Methodology** (experimental setup, equipment used, parameters), **Data Collected** (measurements, observations, raw data references), **Results Analysis** (statistical analysis, patterns observed, anomalies), **Conclusions** (hypothesis supported/refuted, insights gained), **Next Experiments**, **Publication Notes** (paper progress, figures to create, co-author tasks). Include specific measurements, equipment names, and statistical methods.",
  "commandDecisions": [{"decision": "experimental design, methodology, or analysis decision", "rationale": "scientific justification", "madeBy": "researcher name or 'Team'", "impact": "how this affects research direction or results"}],
  "taskAssignments": [{"task": "experiment to run, analysis to perform, figure to create, section to write", "assignee": "researcher name or 'Unassigned'", "dueDate": "deadline or 'Before next meeting'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "equipment malfunction, contaminated data, unexpected results, or methodology issue", "context": "experimental context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "troubleshooting step or methodological adjustment"}],
  "nextMissionGoals": ["experiments to replicate, new hypotheses to test, analyses to complete, manuscript sections to write"],
  "proofChecklist": ["research docs: lab notebook entries, raw data files, statistical analysis code, figures/plots, IRB approvals, equipment calibration logs"],
  "judgeRecap": "Paragraph summarizing: research question being investigated, experimental approach, key findings, how results advance the field, and next steps. Suitable for lab meetings, advisor updates, or grant reports.",
  "missingDocumentationWarnings": ["research warnings: 'Control conditions not specified', 'Sample size not mentioned', 'Statistical test not documented', 'No mention of reproducibility measures']
}`,

    freelance: `${basePrompt}

FREELANCE MODE: This is a freelance developer or consultant tracking client work. Generate documentation focused on deliverables, client communication, time tracking, and invoicing.

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "Freelance Project Log with sections: **Date & Client**, **Project/Phase**, **Work Completed** (specific deliverables, features built, bugs fixed), **Client Communication** (feedback received, decisions approved, change requests), **Time Spent** (if mentioned), **Technical Implementation** (tools, frameworks, code changes), **Blockers** (waiting on client, technical challenges), **Next Deliverables**, **Invoice Notes** (billable hours, milestones reached). Be specific about what was delivered and client approvals.",
  "commandDecisions": [{"decision": "technical approach, scope change, or client request", "rationale": "client need or technical constraint", "madeBy": "freelancer or 'Client'", "impact": "how this affects timeline, scope, or budget"}],
  "taskAssignments": [{"task": "feature to build, revision to make, documentation to write, client follow-up", "assignee": "freelancer name or 'Client (pending)'", "dueDate": "deadline or 'Before next deliverable'", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "bug found, scope creep, client delay, payment issue, or technical blocker", "context": "project context", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "solution or client communication needed"}],
  "nextMissionGoals": ["deliverables to complete, client meetings to schedule, invoices to send"],
  "proofChecklist": ["freelance docs: commit logs, deployed features, client approval emails, time tracking screenshots, invoice records, change order forms"],
  "judgeRecap": "Paragraph summarizing: what client project this is for, what deliverables were completed, any scope changes or challenges, client satisfaction, and what's next. Suitable for portfolio case studies or weekly client updates.",
  "missingDocumentationWarnings": ["freelance warnings: 'Hours not tracked for this task', 'Client approval not documented', 'Scope change without change order', 'No estimate provided for next phase']
}`,

    enterprise: `${basePrompt}

ENTERPRISE MODE: This is an enterprise/corporate engineering team meeting. Generate documentation focused on system architecture, stakeholder communication, compliance, and cross-team coordination.

Analyze the meeting transcript and return JSON with this exact structure:
{
  "summary": "Concise mission summary (2-4 sentences)",
  "engineeringNotebookEntry": "Enterprise Engineering Log with sections: **Date & Project**, **Team Members Present**, **System/Service Discussed**, **Architecture Decisions** (design patterns, infrastructure changes, API contracts), **Implementation Progress** (sprint status, features shipped, deployments), **Stakeholder Updates** (business requirements, executive feedback, compliance needs), **Cross-Team Dependencies** (blocking teams, integration points), **Incidents/Outages** (if any, with root cause), **Security & Compliance** (audits, PII handling, SOC2 requirements), **Next Sprint OKRs**. Include ticket numbers, service names, and stakeholder names when mentioned.",
  "commandDecisions": [{"decision": "architecture, infrastructure, or process decision", "rationale": "business need, technical constraint, or stakeholder requirement", "madeBy": "engineer/PM/stakeholder name or 'Team'", "impact": "how this affects system reliability, scalability, cost, or timeline"}],
  "taskAssignments": [{"task": "feature, bug fix, infrastructure change, documentation, or stakeholder follow-up", "assignee": "engineer name, team name, or 'TBD'", "dueDate": "sprint deadline or specific date", "priority": "CRITICAL|HIGH|MEDIUM|LOW", "status": "PENDING"}],
  "systemAnomalies": [{"problem": "production incident, performance degradation, security vulnerability, or technical debt", "context": "system/service affected", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "suggestedFix": "remediation plan, runbook reference, or escalation path"}],
  "nextMissionGoals": ["sprint objectives, stakeholder meetings, compliance deadlines, system migrations"],
  "proofChecklist": ["enterprise docs: architecture diagrams, API documentation, runbooks, incident reports, compliance checklists, stakeholder presentations, sprint retrospectives"],
  "judgeRecap": "Paragraph summarizing: what business problem or system need was addressed, technical approach taken, stakeholder alignment achieved, risks mitigated, and next priorities. Suitable for leadership updates or quarterly business reviews.",
  "missingDocumentationWarnings": ["enterprise warnings: 'No runbook updated for this change', 'Stakeholder sign-off not documented', 'No rollback plan mentioned', 'Compliance review not scheduled', 'No monitoring/alerting defined']
}`
  };

  if (mode === "custom") {
    return modePrompts.standard;
  }

  return modePrompts[mode];
}

function getUserPrompt(transcript: string, crew: string, mode: MissionMode, customCategory?: string): string {
  const crewList = crew.trim() ? `Crew members present: ${crew}` : "Crew members: extract from transcript context clues or mark as 'Unknown'";

  if (mode === "custom" && customCategory) {
    return `This is a ${customCategory} team meeting. Focus on properly documenting the work discussed using ${customCategory} terminology and standards.

${crewList}

MEETING TRANSCRIPT:
---
${transcript}
---

Analyze this transcript and generate the structured documentation. Be thorough and specific. Include actual names, measurements, technical details, and industry-specific information when mentioned. If something is vague in the transcript, note it in missingDocumentationWarnings. Remember: respond with valid JSON only, no markdown formatting.`;
  }

  const modeContext: Record<Exclude<MissionMode, "custom">, string> = {
    standard: "This is a general engineering/team meeting. Focus on properly documenting the work discussed.",
    vex: "This is a VEX Robotics team meeting. Pay special attention to robot design changes, programming updates, test results with specific data, and engineering design process documentation that VEX judges expect.",
    hackathon: "This is a hackathon team meeting. Focus on feature progress, technical decisions, demo readiness, and timeline tracking.",
    startup: "This is a startup team meeting. Focus on product development, user feedback, growth metrics, and strategic decisions.",
    research: "This is a research lab meeting. Focus on experiments, methodology, results analysis, and publication planning.",
    freelance: "This is a freelance developer tracking client work. Focus on deliverables, client communication, and time tracking.",
    enterprise: "This is an enterprise engineering team meeting. Focus on system architecture, stakeholder communication, and cross-team coordination.",
  };

  if (mode === "custom") {
    return `This is a custom team meeting. Focus on properly documenting the work discussed.

${crewList}

MEETING TRANSCRIPT:
---
${transcript}
---

Analyze this transcript and generate the structured documentation. Be thorough and specific. Remember: respond with valid JSON only.`;
  }

  return `${modeContext[mode]}

${crewList}

MEETING TRANSCRIPT:
---
${transcript}
---

Analyze this transcript and generate the structured documentation. Be thorough and specific. Include actual names, measurements, and technical details when mentioned. If something is vague in the transcript, note it in missingDocumentationWarnings. Remember: respond with valid JSON only, no markdown formatting.`;
}

export async function generateMissionLog(
  transcript: string,
  crew: string,
  mode: MissionMode,
  title: string,
  customCategory?: string
): Promise<MissionLog> {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;

  if (!apiKey) {
    throw new Error("NVIDIA_NIM_API_KEY environment variable is not set");
  }

  const response = await fetch(NVIDIA_NIM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "z-ai/glm-5.1",
      messages: [
        { role: "system", content: getSystemPrompt(mode, customCategory) },
        { role: "user", content: getUserPrompt(transcript, crew, mode, customCategory) },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA NIM API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from NVIDIA NIM API");
  }

  let parsed: Record<string, unknown>;
  try {
    const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    parsed = JSON.parse(cleanContent);
  } catch {
    throw new Error(`Failed to parse NVIDIA NIM response as JSON. Raw: ${content.substring(0, 500)}`);
  }

  const mission: MissionLog = {
    id: uuidv4(),
    title,
    missionMode: mode,
    crew: crew.split(",").map((c) => c.trim()).filter(Boolean),
    date: new Date().toISOString(),
    rawTranscript: transcript,
    summary: (parsed.summary as string) || "",
    engineeringNotebookEntry: (parsed.engineeringNotebookEntry as string) || "",
    commandDecisions: (parsed.commandDecisions as CommandDecision[]) || [],
    taskAssignments: (parsed.taskAssignments as TaskAssignment[]) || [],
    systemAnomalies: (parsed.systemAnomalies as SystemAnomaly[]) || [],
    nextMissionGoals: (parsed.nextMissionGoals as string[]) || [],
    proofChecklist: (parsed.proofChecklist as string[]) || [],
    judgeRecap: (parsed.judgeRecap as string) || "",
    missingDocumentationWarnings: (parsed.missingDocumentationWarnings as string[]) || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectName: "",
  };

  return mission;
}