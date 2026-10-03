import { useState } from "react";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const PROJECT_TYPES = ["Consulting", "Web Development", "Marketing", "Design", "Construction", "Freelance"];
const BUDGETS = ["Under $5,000", "$5,000 – $25,000", "$25,000 – $100,000", "$100,000+"];
const TIMELINES = ["1–2 weeks", "1 month", "2–3 months", "3–6 months", "6+ months"];

function generateOutline(type, client, budget, timeline) {
  return {
    executive: `This proposal outlines a ${type.toLowerCase()} engagement for ${client || "the client"}. The project is scoped at ${budget} with an estimated timeline of ${timeline}. Our team brings deep expertise in ${type.toLowerCase()} and a proven track record of delivering results on time and within budget.`,
    scope: [
      `Discovery and requirements gathering for ${client || "the client"}`,
      `${type} strategy development and planning`,
      "Detailed project roadmap with milestones",
      "Implementation and execution",
      "Quality assurance and review cycles",
      "Final delivery and handover documentation",
    ],
    deliverables: [
      `Comprehensive ${type.toLowerCase()} plan`,
      "Weekly progress reports",
      "Mid-project review presentation",
      "Final deliverables package",
      "Post-project support documentation",
    ],
    timeline: `The project will be completed within ${timeline}, broken into discovery (20%), execution (60%), and review/delivery (20%) phases.`,
    budget: `Total project investment: ${budget}. Payment terms: 30% upfront, 40% at midpoint, 30% on delivery. All costs include project management and communication overhead.`,
    terms: "Standard terms include two rounds of revisions, weekly status updates, and a 30-day post-delivery support period. Additional revisions billed at the agreed hourly rate.",
  };
}

export default function GeneratorPage() {
  usePageTitle("Free Proposal Generator — Create Professional Proposals Instantly");

  const [type, setType] = useState("Consulting");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [timeline, setTimeline] = useState(TIMELINES[2]);
  const [result, setResult] = useState(null);

  const handleGenerate = () => {
    const outline = generateOutline(type, client, budget, timeline);
    setResult(outline);
    track("proposal_generate", { type, budget });
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Proposal Generator</h1>
          <p className="tool-subtitle">
            Generate a professional proposal outline instantly. No sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Project Type
              <select className="calc-select" value={type} onChange={(e) => setType(e.target.value)}>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label className="calc-label">
              Client Name
              <input
                type="text"
                className="calc-input"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Enter client or company name"
              />
            </label>

            <label className="calc-label">
              Budget Range
              <select className="calc-select" value={budget} onChange={(e) => setBudget(e.target.value)}>
                {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>

            <label className="calc-label">
              Timeline
              <select className="calc-select" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <button className="btn btn-primary" onClick={handleGenerate} style={{ marginTop: "0.5rem" }}>
              Generate Proposal Outline
            </button>

            {result && (
              <div className="calc-result" aria-live="polite">
                <h3 style={{ margin: "0 0 0.75rem", color: "var(--ink-strong, #fff)" }}>
                  {type} Proposal for {client || "Client"}
                </h3>

                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--brand, #F0B429)" }}>Executive Summary</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>{result.executive}</p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--brand, #F0B429)" }}>Project Scope</strong>
                  <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1.25rem", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>
                    {result.scope.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--brand, #F0B429)" }}>Deliverables</strong>
                  <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1.25rem", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>
                    {result.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--brand, #F0B429)" }}>Timeline &amp; Milestones</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>{result.timeline}</p>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--brand, #F0B429)" }}>Budget Breakdown</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>{result.budget}</p>
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                  <strong style={{ color: "var(--brand, #F0B429)" }}>Terms &amp; Conditions</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>{result.terms}</p>
                </div>

                <ShareButtons
                  path="/generator"
                  text={`Just generated a ${type} proposal outline on DoAide Proposals — free tool!`}
                />
              </div>
            )}
          </div>

          <section className="tool-info">
            <h2>How to Write a Winning Proposal</h2>
            <p>
              A great proposal clearly communicates your value proposition, sets realistic expectations,
              and makes it easy for the client to say yes. Here are the essential sections every proposal needs.
            </p>
            <h3>Executive Summary</h3>
            <p>Lead with the client's problem and your solution. Keep it under 200 words.</p>
            <h3>Project Scope</h3>
            <p>Define what's included and what's not. Clear scope prevents scope creep and protects both parties.</p>
            <h3>Pricing</h3>
            <p>Break down costs by deliverable or phase. Transparency builds trust and reduces back-and-forth.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
