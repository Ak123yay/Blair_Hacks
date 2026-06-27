import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardCheck,
  Clock3,
  Code2,
  FileText,
  Mic,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MissionLog - AI Engineering Notebook",
  description:
    "Turn messy team meetings into organized engineering logs, task lists, and judge-ready progress summaries for robotics and hackathon teams.",
};

const proofItems = [
  ["Built for", "Robotics and hackathon teams", Rocket],
  ["Input", "Meeting notes, transcripts, or audio", Mic],
  ["Output", "Logs, tasks, decisions, and proof", ClipboardCheck],
  ["Storage", "Team-ready mission history", ShieldCheck],
];

const workflow = [
  {
    eyebrow: "Step 01",
    title: "Drop in the meeting",
    body: "Paste rough notes or upload a recording. MissionLog keeps the workflow direct so teams can document right after a build session.",
    icon: Mic,
    note: "Notes or audio",
  },
  {
    eyebrow: "Step 02",
    title: "Generate the log",
    body: "The app extracts decisions, owners, anomalies, next goals, and a polished engineering notebook entry from the raw discussion.",
    icon: Sparkles,
    note: "About 30 seconds",
  },
  {
    eyebrow: "Step 03",
    title: "Review and ship",
    body: "Save the mission, browse the timeline, and keep a clean record for judging, demos, standups, and team accountability.",
    icon: FileText,
    note: "Ready to share",
  },
];

const features = [
  ["Mode-aware prompts", "VEX, hackathon, startup, research, freelance, enterprise, and custom team contexts.", Code2],
  ["Decision tracking", "Capture what the team chose, who made the call, and why it matters.", ClipboardCheck],
  ["Task extraction", "Turn scattered action items into assigned objectives with priority and due dates.", Users],
  ["Timeline view", "See project progress across saved missions without digging through old notes.", Clock3],
  ["Analytics", "Understand mission volume, task load, and documentation trends over time.", BarChart3],
  ["Judge-ready recap", "Summarize the proof points that make a robotics notebook easier to evaluate.", ShieldCheck],
];

const plans = [
  {
    name: "Scout",
    price: "$0",
    period: "free",
    description: "For trying the workflow with a small team.",
    features: ["5 missions per month", "Standard generation mode", "Timeline view", "Local mission history"],
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Commander",
    price: "$9",
    period: "/mo",
    description: "For active teams documenting every build cycle.",
    features: ["Unlimited missions", "All AI modes", "Analytics dashboard", "PDF, Markdown, and JSON exports"],
    cta: "Start trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Fleet",
    price: "$29",
    period: "/mo",
    description: "For clubs, classrooms, and multi-project teams.",
    features: ["Unlimited members", "Multiple projects", "API access", "Priority support"],
    cta: "View upgrade",
    href: "/upgrade",
  },
];

function SectionHeading({
  eyebrow,
  title,
  body,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "landing-section-heading centered" : "landing-section-heading"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="serif">{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

function BrowserPreview() {
  return (
    <div className="landing-browser">
      <div className="landing-browser-bar">
        <span />
        <span />
        <span />
        <div>missionlog.app/new</div>
      </div>
      <div className="landing-browser-body">
        <div>
          <p className="mono">Live generation</p>
          <h3 className="serif">Build Session #12</h3>
          <p>
            Autonomous tuning improved turn accuracy from 5 degrees off to 2 degrees.
            Arm prototype needs a ratchet redesign before the next field test.
          </p>
          <div className="landing-mini-grid">
            {["3 tasks", "2 decisions", "1 anomaly", "Judge recap"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="landing-agent-card">
          <div className="landing-agent-row done">
            <span />
            <div>
              <strong>Transcript parsed</strong>
              <small>Speaker notes normalized</small>
            </div>
          </div>
          <div className="landing-agent-row done">
            <span />
            <div>
              <strong>Tasks extracted</strong>
              <small>Owners and due dates found</small>
            </div>
          </div>
          <div className="landing-agent-row active">
            <span />
            <div>
              <strong>Notebook drafted</strong>
              <small>Engineering entry in progress</small>
            </div>
          </div>
          <div className="agent-progress-bar">
            <div className="agent-progress-bar-fill" style={{ width: "68%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="landing-page">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <p className="eyebrow">AI documentation for build teams</p>
            <h1 className="serif">
              Turn messy meetings into <span className="serif-italic">usable engineering logs</span>.
            </h1>
            <p>
              MissionLog is an AI mission-control platform for student engineering teams.
              It turns messy meetings, build notes, photos, and code progress into
              structured engineering notebook entries, task lists, design-decision
              records, evidence checklists, project timelines, and judge-ready recaps.
            </p>
            <div className="landing-actions">
              <Link href="/signup" className="btn btn-accent btn-lg">
                Start free
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/login" className="btn btn-soft btn-lg">
                Sign in
              </Link>
            </div>
            <div className="landing-trust-row mono">
              <span><Check size={13} /> No credit card</span>
              <span><Check size={13} /> Audio or notes</span>
              <span><Check size={13} /> Built for teams</span>
            </div>
          </div>
          <BrowserPreview />
        </section>

        <section className="landing-proof-strip">
          {proofItems.map(([label, value, Icon]) => {
            const ProofIcon = Icon as typeof Rocket;
            return (
              <div className="landing-proof-card" key={label as string}>
                <span>
                  <ProofIcon size={17} aria-hidden="true" />
                </span>
                <div>
                  <p className="mono">{label as string}</p>
                  <strong>{value as string}</strong>
                </div>
              </div>
            );
          })}
        </section>

        <section className="landing-section">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps. No documentation backlog."
            body="The Onara reference is simple and operational. MissionLog should feel the same: one clear path from raw material to a polished artifact."
          />
          <div className="landing-card-grid three">
            {workflow.map((step) => {
              const Icon = step.icon;
              return (
                <article className="card hover-lift landing-workflow-card" key={step.title}>
                  <div className="landing-card-topline">
                    <p className="mono">{step.eyebrow}</p>
                    <span className="hand">{step.note}</span>
                  </div>
                  <span className="landing-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="serif">{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="features" className="landing-section landing-band">
          <SectionHeading
            centered
            eyebrow="Mission-ready features"
            title="Designed around the records teams actually need."
            body="The UI stays compact and practical: proof, owners, decisions, anomalies, progress, and next steps."
          />
          <div className="landing-feature-grid">
            {features.map(([title, body, Icon]) => {
              const FeatureIcon = Icon as typeof Rocket;
              return (
                <article className="card landing-feature-card" key={title as string}>
                  <span className="landing-icon small">
                    <FeatureIcon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title as string}</h3>
                    <p>{body as string}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="pricing" className="landing-section">
          <SectionHeading
            centered
            eyebrow="Pricing"
            title="Simple plans for student teams and serious builders."
            body="Keep the pricing surface clean, like Onara: direct tiers, clear benefits, and obvious next actions."
          />
          <div className="landing-card-grid three">
            {plans.map((plan) => (
              <article
                className={plan.highlighted ? "card card-accent landing-price-card highlighted" : "card landing-price-card"}
                key={plan.name}
              >
                {plan.highlighted ? <span className="badge badge-accent">Most popular</span> : null}
                <h3 className="serif">{plan.name}</h3>
                <p>{plan.description}</p>
                <div className="landing-price">
                  <strong className="serif">{plan.price}</strong>
                  <span>{plan.period}</span>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={plan.highlighted ? "btn btn-accent" : "btn btn-soft"}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-final-cta">
          <p className="mono">Ready in one meeting</p>
          <h2 className="serif">Stop losing decisions in chat threads and half-finished docs.</h2>
          <p>
            Create a clean mission log while the meeting is still fresh, then keep the
            whole team moving from the same record.
          </p>
          <Link href="/signup" className="btn btn-accent btn-lg">
            Generate your first mission
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <footer className="landing-footer">
        <div>
          <Link href="/" className="missionlog-logo">
            <div className="missionlog-logo-mark" aria-hidden="true" />
            Mission<span className="serif-italic">Log</span>
          </Link>
          <p>AI engineering documentation for robotics and hackathon teams.</p>
        </div>
        <div>
          <a href="#pricing">Pricing</a>
          <Link href="/login">Sign in</Link>
          <Link href="/signup">Start free</Link>
        </div>
      </footer>
    </>
  );
}
