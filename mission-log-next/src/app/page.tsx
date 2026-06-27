import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardCheck,
  Clock3,
  Code2,
  FileCheck2,
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
  ["Drafts", "Rough notes become structured logs", FileText],
  ["Quality gate", "Final export blocked until ready", ShieldCheck],
  ["Evidence", "Claims checked against proof", ClipboardCheck],
  ["Memory", "Decisions stay searchable", Rocket],
];

const workflow = [
  {
    eyebrow: "Step 01",
    title: "Paste the messy notes",
    body: "Drop in rough meeting notes, transcript text, or audio from the build session while the details are still fresh.",
    icon: Mic,
    note: "2 minutes",
  },
  {
    eyebrow: "Step 02",
    title: "Find the missing proof",
    body: "MissionLog drafts the page, scores notebook quality, checks claims against evidence, and asks the follow-up questions a judge would ask.",
    icon: Sparkles,
    note: "Quality gate",
  },
  {
    eyebrow: "Step 03",
    title: "Export only when ready",
    body: "Weak notes stay in Draft Log mode. Final notebook export unlocks when the page has real metadata, testing, data, and evidence.",
    icon: FileCheck2,
    note: "70%+ quality",
  },
];

const features = [
  ["Quality-gated export", "Draft logs cannot become final PDFs until required engineering details are present.", ShieldCheck],
  ["Evidence-to-claim checks", "Claims are marked Strong, Weak, or Missing based on attached proof, not AI confidence.", ClipboardCheck],
  ["Testing tables", "Trial counts and pass/fail results turn vague progress into defensible engineering data.", BarChart3],
  ["Decision graph", "Trace the chain from problem to diagnosis, fix, test, result, evidence, and next iteration.", Code2],
  ["Follow-up questions", "The app asks for exact errors, subsystems, test counts, data, and evidence when notes are vague.", Users],
  ["Design memory", "Saved decisions become searchable answers with source citations later.", Clock3],
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
      <div className="landing-browser-body landing-browser-body-upgraded">
        <div className="landing-preview-main">
          <div className="landing-preview-kicker">
            <span />
            Draft Log
          </div>
          <h3 className="serif">Autonomous Turning Fix</h3>
          <p>
            The robot drifted left during turns. MissionLog found the missing
            test data, evidence, and root-cause details before final export.
          </p>
          <div className="landing-quality-card">
            <div>
              <p className="mono">Notebook quality</p>
              <strong className="serif">68%</strong>
            </div>
            <span>Final PDF blocked</span>
          </div>
          <div className="landing-claim-table">
            <div><span>Claim</span><span>Status</span></div>
            <div><span>Turn speed reduced</span><b>Weak</b></div>
            <div><span>Robot improved to 4/5</span><b>Missing</b></div>
            <div><span>Testing video attached</span><b>Missing</b></div>
          </div>
        </div>
        <div className="landing-agent-card">
          <div className="landing-agent-row done">
            <span />
            <div>
              <strong>Metadata checked</strong>
              <small>Date, team, project, type</small>
            </div>
          </div>
          <div className="landing-agent-row done">
            <span />
            <div>
              <strong>Claims matched</strong>
              <small>Evidence strength calculated</small>
            </div>
          </div>
          <div className="landing-agent-row active">
            <span />
            <div>
              <strong>Questions generated</strong>
              <small>Ask for test data and proof</small>
            </div>
          </div>
          <div className="landing-followup-card">
            <p className="mono">Follow-up</p>
            <strong>How many trials did you run after the fix?</strong>
            <small>Needed for final notebook export.</small>
          </div>
          <div className="landing-test-grid">
            {["Fail", "Success", "Success", "Success"].map((item, index) => (
              <div key={`${item}-${index}`}>
                <span>Trial {index + 1}</span>
                <b>{item}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransformationPreview() {
  return (
    <section className="landing-transform">
      <div className="container">
        <div className="landing-transform-heading">
          <p className="eyebrow">The upgrade</p>
          <h2 className="serif">
            MissionLog does not make weak notes look finished.
            <span className="serif-italic"> It makes them stronger.</span>
          </h2>
        </div>
        <div className="landing-transform-grid">
          <div className="landing-transform-card">
            <div className="mono">Raw meeting notes</div>
            <p>
              fixed code errors today. robot was weird. aarush changed auton and
              it worked better. need video later.
            </p>
            <ul>
              <li>Invalid date risk</li>
              <li>No root cause</li>
              <li>No test data</li>
              <li>No evidence attached</li>
            </ul>
          </div>
          <div className="landing-transform-arrow">
            <span className="hand">quality gate</span>
            <i />
            <b className="mono">missionlog</b>
          </div>
          <div className="landing-transform-card final">
            <div className="mono">Engineering notebook page</div>
            <h3 className="serif">Starting Problem</h3>
            <p>The robot drifted left during autonomous turns and missed the scoring zone.</p>
            <h3 className="serif">Test Data</h3>
            <p>After reducing turn speed, the robot completed 4 out of 5 trials.</p>
            <div className="landing-transform-status">
              <span>Evidence needed</span>
              <strong>Video or code diff</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="landing-page">
        <section className="landing-hero">
          <div className="landing-hero-copy landing-hero-copy-centered">
            <div className="landing-live-pill mono">
              <span />
              Quality-gated notebooks for build teams
            </div>
            <h1 className="landing-hero-title">
              <span>Meeting notes aren&apos;t enough.</span>
              <span><em>We build your notebook</em></span>
              <span>into engineering proof.</span>
            </h1>
            <p>
              MissionLog turns meetings, test notes, decisions, and evidence gaps
              into a judge-ready engineering notebook workflow.
            </p>
            <div className="landing-search-cta">
              <Mic size={18} aria-hidden="true" />
              <span>Paste meeting notes...</span>
              <Link href="/signup" className="btn btn-accent">
                Generate Draft Free
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="landing-trust-row mono">
              <span><Check size={13} /> No credit card</span>
              <span><Check size={13} /> Draft-first workflow</span>
              <span><Check size={13} /> Final export gate</span>
            </div>
          </div>
          <div className="landing-hero-preview">
            <BrowserPreview />
          </div>
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

        <TransformationPreview />

        <section className="landing-section">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps. No documentation theater."
            body="MissionLog keeps the path direct: capture the session, expose the gaps, then export only when the engineering record is defensible."
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
