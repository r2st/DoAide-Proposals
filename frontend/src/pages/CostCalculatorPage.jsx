import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const PROJECT_TYPES = ["Consulting", "Web Development", "Marketing", "Design", "Construction", "Freelance"];

function parseParams(search) {
  const p = new URLSearchParams(search);
  return {
    type: p.get("type") || "Consulting",
    team: parseInt(p.get("team"), 10) || 3,
    weeks: parseInt(p.get("weeks"), 10) || 8,
    rate: parseInt(p.get("rate"), 10) || 100,
  };
}

function calcUrl(type, team, weeks, rate) {
  return `/calculator?type=${encodeURIComponent(type)}&team=${team}&weeks=${weeks}&rate=${rate}`;
}

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function CostCalculatorPage() {
  usePageTitle("Free Project Cost Estimator — Calculate Project Budgets");
  const location = useLocation();
  const navigate = useNavigate();

  const initial = parseParams(location.search);
  const [type, setType] = useState(initial.type);
  const [team, setTeam] = useState(initial.team);
  const [weeks, setWeeks] = useState(initial.weeks);
  const [rate, setRate] = useState(initial.rate);

  const labor = team * weeks * 40 * rate;
  const overhead = Math.round(labor * 0.15);
  const tools = Math.round(labor * 0.05);
  const contingency = Math.round(labor * 0.10);
  const total = labor + overhead + tools + contingency;

  useEffect(() => {
    const url = calcUrl(type, team, weeks, rate);
    if (location.search !== url.replace("/calculator", "")) {
      navigate(url, { replace: true });
    }
  }, [type, team, weeks, rate, navigate, location.search]);

  useEffect(() => {
    track("cost_calculate", { type, team, weeks, rate, total });
  }, [type, team, weeks, rate, total]);

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Project Cost Estimator</h1>
          <p className="tool-subtitle">
            Estimate your project budget instantly. No sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Project Type
              <select className="calc-select" value={type} onChange={(e) => setType(e.target.value)}>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label className="calc-label">
              Team Size
              <input
                type="number"
                className="calc-input"
                value={team}
                onChange={(e) => setTeam(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                max="50"
              />
            </label>

            <label className="calc-label">
              Duration (weeks)
              <input
                type="number"
                className="calc-input"
                value={weeks}
                onChange={(e) => setWeeks(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                max="104"
              />
            </label>

            <label className="calc-label">
              Hourly Rate ($)
              <input
                type="number"
                className="calc-input"
                value={rate}
                onChange={(e) => setRate(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                step="5"
              />
            </label>

            <div className="calc-result" aria-live="polite">
              <div className="calc-result-row">
                <span>Labor Cost ({team} × {weeks}wk × 40hr × {fmt(rate)}/hr)</span>
                <strong>{fmt(labor)}</strong>
              </div>
              <div className="calc-result-row">
                <span>Overhead (15%)</span>
                <strong>{fmt(overhead)}</strong>
              </div>
              <div className="calc-result-row">
                <span>Tools &amp; Software (5%)</span>
                <strong>{fmt(tools)}</strong>
              </div>
              <div className="calc-result-row">
                <span>Contingency (10%)</span>
                <strong>{fmt(contingency)}</strong>
              </div>
              <div className="calc-result-row calc-total">
                <span>Estimated Total</span>
                <strong>{fmt(total)}</strong>
              </div>

              <ShareButtons
                path={calcUrl(type, team, weeks, rate)}
                text={`${type} project estimate: ${fmt(total)} (${team} people, ${weeks} weeks) — calculated free on DoAide Proposals`}
              />
            </div>
          </div>

          <section className="tool-info">
            <h2>How to Estimate Project Costs</h2>
            <p>
              Accurate project estimation prevents budget overruns and builds client trust. Start with
              labor costs as your baseline, then add overhead for management, tools, and contingency
              for unexpected work.
            </p>
            <h3>Key Cost Components</h3>
            <ul>
              <li><strong>Labor</strong> — The core cost: team size × hours × hourly rate</li>
              <li><strong>Overhead (15%)</strong> — Project management, meetings, communication</li>
              <li><strong>Tools (5%)</strong> — Software licenses, cloud services, equipment</li>
              <li><strong>Contingency (10%)</strong> — Buffer for scope changes and unknowns</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
