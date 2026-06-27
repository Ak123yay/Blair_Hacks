<div align="center">

# MissionLog

[![Status](https://img.shields.io/badge/Status-Active%20Development-yellow?style=for-the-badge)](#current-status)
[![AI](https://img.shields.io/badge/AI-GLM%205.1-6366f1?style=for-the-badge)](#ai-use)
[![License](https://img.shields.io/badge/License-Private-blue?style=for-the-badge)](#license)
<br />
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![NVIDIA NIM](https://img.shields.io/badge/NVIDIA%20NIM-76B900?style=flat-square&logo=nvidia&logoColor=white)

</div>

<img width="2558" height="1263" alt="image" src="https://github.com/user-attachments/assets/da87cfdc-1ccb-4aa5-9146-82cddb0a31c3" />

MissionLog is an AI engineering notebook for robotics, hackathon, and technical teams.

The idea is simple: a team should be able to paste messy meeting notes or upload audio, then get a draft mission log that identifies gaps, asks follow-up questions, and only becomes a final notebook page when the engineering details are strong enough.

MissionLog is built around student engineering workflows, especially VEX-style documentation where teams need to prove what changed, why it changed, what testing happened, and what evidence supports each claim.

## Why I built this

Engineering notebooks are important, but teams often fall behind because writing them is slow.

MissionLog turns meeting notes into structured documentation while the context is still fresh. It is meant to help teams:

- remember why decisions were made
- create better judge-ready notebook pages
- track owners and next steps
- find missing evidence before competition
- ask old design memory questions later

## Current status

MissionLog is in active development.

Working areas include:

- account creation and login
- AI mission generation with GLM 5.1
- robotics, hackathon, startup, research, freelance, enterprise, and custom modes
- audio transcription flow
- required mission metadata validation
- mission saving with Supabase
- local fallback storage
- draft logs and final notebook pages
- notebook quality scoring
- final PDF export quality gate
- task and decision extraction
- evidence gap detection
- evidence-to-claim matching
- AI follow-up questions
- testing table generation
- design decision graph
- judge-readiness scoring
- PDF export through browser print
- AI-powered Design Memory answers
- sample robotics demo data

## What MissionLog does

A user can:

1. Sign in.
2. Create a new mission.
3. Enter real metadata: date, project, mission title, team members, and meeting type.
4. Paste meeting notes, upload audio, or load the sample robotics demo.
5. Choose a mission mode.
6. Generate a structured draft log with AI.
7. Review follow-up questions, quality gaps, test data, and evidence-to-claim matches.
8. Save it to the flight log.
9. Export a final notebook page only after the quality gate passes.
10. Ask Design Memory questions later.

Generated mission logs include:

- mission summary
- full engineering notebook entry
- notebook quality score
- command decisions
- task assignments
- system anomalies
- next mission goals
- proof checklist
- evidence-to-claim matches
- AI follow-up questions
- testing table
- design decision graph
- judge-ready recap
- missing documentation warnings
- notebook page artifact
- evidence vault entries
- design memory answers

## How the AI flow works

At a high level:

```text
Meeting notes / transcript
  -> required metadata validation
  -> mission mode prompt
  -> GLM 5.1 generation
  -> structured mission JSON
  -> draft notebook page, tasks, evidence, judge prep
  -> quality gate and follow-up questions
  -> final notebook export when ready
  -> saved mission history
  -> Design Memory question answering
```

For Design Memory:

```text
Saved missions
  -> extract decisions, summaries, notebook entries
  -> retrieve related memory chunks
  -> ask GLM 5.1 with only those sources
  -> return cited answer
```

This is a RAG-style workflow. It does not yet use pgvector embeddings, but the app is structured around the same retrieval-first idea.

## AI use

MissionLog uses AI for:

- turning rough notes into structured logs
- writing engineering notebook entries
- extracting task assignments
- identifying command decisions
- detecting missing evidence
- asking follow-up questions when notes are vague
- creating judge-ready summaries
- generating likely judge prep material
- answering questions from saved design memory
- repairing malformed JSON responses when a model output is cut off

Regular application code handles:

- authentication
- mission ownership
- Supabase persistence
- local fallback storage
- metadata validation
- notebook quality scoring
- draft/final export gating
- evidence strength rules
- export/download behavior
- routing and permissions
- UI state and validation

## Notebook quality gate

MissionLog separates weak drafts from final notebook pages.

New mission generation requires:

- date
- project name
- mission title
- real team member names
- meeting type: software, mechanical, testing, strategy, or competition

Placeholder metadata is blocked before generation. Examples include:

```text
Invalid Date
unknown
test
asdf
dsa
N/A
```

Every notebook is scored against engineering documentation criteria:

| Category | Points |
| --- | ---: |
| Real date/team/project | 10 |
| Specific problem | 15 |
| Root cause or diagnosis | 15 |
| Specific fix or design change | 15 |
| Test procedure | 15 |
| Test data | 15 |
| Actual evidence attached or linked | 15 |

If the score is below 70%, the log stays in Draft Log mode and final PDF export is blocked. The UI shows the missing information and follow-up questions needed to make the page stronger.

Evidence strength is calculated by application logic:

- Strong: actual uploaded or linked file, image, video, commit, log, or test table exists
- Weak: evidence is mentioned but not attached
- Missing: no proof exists

The AI is instructed not to invent details. Missing fields should be marked as `Not documented`.

## Tech stack

### App

- Next.js 16
- React 19
- TypeScript
- CSS
- Lucide icons

### Backend and data

- Supabase Auth
- Supabase database
- Supabase SSR helpers
- localStorage fallback

### AI and media

- NVIDIA NIM
- GLM 5.1
- AssemblyAI transcription

## Repository layout

```text
mission-log-next/
  src/
    app/                 Next.js routes, API routes, workspace pages
    app/api/generate/    Mission generation endpoint
    app/api/memory/      AI Design Memory answer endpoint
    components/          Mission form, results, dashboard shell, cards
    contexts/            Auth provider
    lib/                 GLM, storage, Supabase, mission helpers
    types/               MissionLog TypeScript types
  public/                Static assets
```

## Running locally

These commands match a Windows PowerShell setup.

```powershell
cd C:\Users\Aarush\Downloads\Blair_Hacks\mission-log-next
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Useful checks:

```powershell
npm.cmd run lint
npm.cmd run build
```

## Environment variables

Create `.env.local` from `.env.example`.

Main variables:

```dotenv
NVIDIA_NIM_API_KEY=
ASSEMBLYAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not commit real keys or secrets.

## Demo flow

For judging or demos:

1. Go to `New Mission`.
2. Click `Load Sample Robotics Mission`.
3. Click `Generate Mission Log`.
4. Review the Draft Log / Final Notebook Page status.
5. Review notebook quality, follow-up questions, evidence-to-claim matches, testing table, decision graph, tasks, and judge brief.
6. Confirm final PDF export is blocked when quality is below 70%.
7. Add stronger evidence or test data in the notes, regenerate, and verify the quality score improves.
8. Save the mission.
9. Go to `Ask Memory`.
10. Ask something like:

```text
Why did we stop using H-drive?
```

MissionLog retrieves the saved design memory and uses GLM 5.1 to answer with citations.

For metadata validation demos:

1. Try to create a mission with a team member like `dsa` or project name like `test`.
2. Confirm generation is blocked with a validation message.

For final export demos:

1. Generate a weak mission with vague notes and no evidence.
2. Confirm `Export Final PDF` is blocked.
3. Use the quality gaps and AI follow-up questions to strengthen the notes.
4. Regenerate and export once the notebook quality score reaches 70% or higher.

## Failure handling

MissionLog tries to avoid blank or dead-end failure states.

Examples:

- If Supabase save fails, the UI shows the real save error.
- If GLM 5.1 returns truncated JSON, the app attempts JSON repair before failing.
- If mission metadata is fake or incomplete, generation is blocked before the AI call.
- If notebook quality is too low, final PDF export is blocked and missing fields are shown.
- If NVIDIA NIM workers are busy, Design Memory retries temporary failures.
- If a user is not signed in, protected workspace routes redirect to login.
- If no related memory is found, Design Memory says it cannot answer from saved missions yet.

## Checks before shipping changes

Run:

```powershell
cd C:\Users\Aarush\Downloads\Blair_Hacks\mission-log-next
npm.cmd run lint
npm.cmd run build
```

Manual checks:

- sign in
- create a mission
- use `Load Sample Robotics Mission`
- generate a mission log
- verify fake metadata is blocked
- verify weak logs stay in Draft Log mode
- verify final PDF export is blocked below 70% quality
- verify evidence-to-claim statuses do not show Strong without attached or linked proof
- save the mission
- open the mission from the dashboard
- export final PDF when quality is high enough
- ask a Design Memory question
- open Settings

## License

MIT Licence
