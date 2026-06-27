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

The idea is simple: a team should be able to paste messy meeting notes or upload audio, then get a clean mission log with notebook entries, tasks, decisions, evidence gaps, judge prep, and searchable design memory.

MissionLog is built around student engineering workflows, especially VEX-style documentation where teams need to prove what changed, why it changed, what testing happened, and what evidence supports the decision.

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
- mission saving with Supabase
- local fallback storage
- engineering notebook pages
- task and decision extraction
- evidence gap detection
- judge-readiness scoring
- PDF export through browser print
- AI-powered Design Memory answers
- sample robotics demo data

## What MissionLog does

A user can:

1. Sign in.
2. Create a new mission.
3. Paste meeting notes, upload audio, or load the sample robotics demo.
4. Choose a mission mode.
5. Generate a structured mission log with AI.
6. Save it to the flight log.
7. Export a notebook page as PDF.
8. Ask Design Memory questions later.

Generated mission logs include:

- mission summary
- full engineering notebook entry
- command decisions
- task assignments
- system anomalies
- next mission goals
- proof checklist
- judge-ready recap
- missing documentation warnings
- notebook page artifact
- evidence vault entries
- design memory answers

## How the AI flow works

At a high level:

```text
Meeting notes / transcript
  -> mission mode prompt
  -> GLM 5.1 generation
  -> structured mission JSON
  -> notebook page, tasks, evidence, judge prep
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
- creating judge-ready summaries
- generating likely judge prep material
- answering questions from saved design memory
- repairing malformed JSON responses when a model output is cut off

Regular application code handles:

- authentication
- mission ownership
- Supabase persistence
- local fallback storage
- export/download behavior
- routing and permissions
- UI state and validation

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
4. Review the notebook page, decisions, tasks, evidence gaps, and judge brief.
5. Save the mission.
6. Go to `Ask Memory`.
7. Ask something like:

```text
Why did we stop using H-drive?
```

MissionLog retrieves the saved design memory and uses GLM 5.1 to answer with citations.

## Failure handling

MissionLog tries to avoid blank or dead-end failure states.

Examples:

- If Supabase save fails, the UI shows the real save error.
- If GLM 5.1 returns truncated JSON, the app attempts JSON repair before failing.
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
- save the mission
- open the mission from the dashboard
- export PDF
- ask a Design Memory question
- open Settings

## License

MIT Licence
