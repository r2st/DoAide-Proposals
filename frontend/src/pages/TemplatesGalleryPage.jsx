import { Link } from "react-router-dom";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TEMPLATES = [
  {
    name: "Consulting Proposal",
    desc: "Professional consulting engagement template with discovery, analysis, and recommendations sections.",
    sections: ["Executive Summary", "Situation Analysis", "Approach & Methodology", "Timeline", "Team & Qualifications", "Investment"],
  },
  {
    name: "Software Development",
    desc: "Technical project proposal covering architecture, sprints, testing, and deployment milestones.",
    sections: ["Project Overview", "Technical Approach", "Architecture", "Sprint Plan", "QA Strategy", "Budget & Timeline"],
  },
  {
    name: "Marketing Campaign",
    desc: "Campaign proposal with strategy, channels, creative direction, and ROI projections.",
    sections: ["Campaign Brief", "Target Audience", "Channel Strategy", "Creative Direction", "Budget Allocation", "KPIs & Measurement"],
  },
  {
    name: "Design Project",
    desc: "Design proposal covering research, concepts, iterations, and final deliverables.",
    sections: ["Design Brief", "Research & Discovery", "Concept Development", "Design System", "Deliverables", "Pricing"],
  },
  {
    name: "Construction Bid",
    desc: "Construction proposal with scope of work, materials, labor, permits, and payment schedule.",
    sections: ["Project Description", "Scope of Work", "Materials & Labor", "Permits & Compliance", "Timeline", "Payment Schedule"],
  },
  {
    name: "Freelance Proposal",
    desc: "Streamlined freelance template with scope, deliverables, rate, and terms.",
    sections: ["Introduction", "Understanding of Needs", "Proposed Solution", "Deliverables", "Rate & Timeline", "Terms"],
  },
];

export default function TemplatesGalleryPage() {
  usePageTitle("Free Proposal Templates — 6 Professional Templates");

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 800 }}>
          <h1 className="tool-title">Proposal Templates</h1>
          <p className="tool-subtitle">
            Start with a proven structure. Pick a template and customize it for your client.
          </p>

          <div style={{ display: "grid", gap: "1rem" }}>
            {TEMPLATES.map((t) => (
              <div key={t.name} className="calc-card">
                <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", color: "var(--ink-strong, #fff)" }}>
                  {t.name}
                </h2>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", color: "var(--ink-soft, #9CA3AF)" }}>
                  {t.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {t.sections.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "rgba(240,180,41,0.1)",
                        color: "#F0B429",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  to="/register"
                  style={{
                    display: "inline-block",
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    background: "#F0B429",
                    color: "#0A0A0B",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Use this template
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <ShareButtons
              path="/templates-gallery"
              text="Free proposal templates for consulting, development, marketing, and more — DoAide Proposals"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
