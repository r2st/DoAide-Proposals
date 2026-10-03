import { useState } from "react";
import ToolsNav from "../components/ToolsNav";
import ShareButtons from "../components/ShareButtons";
import { usePageTitle } from "../hooks/usePageTitle";

const FACTORS = [
  { id: "relationship", label: "Existing Relationship", weight: 20, options: ["None", "Cold outreach", "Warm lead", "Existing client"] },
  { id: "competition", label: "Competition Level", weight: 15, options: ["Many competitors", "3-5 competitors", "1-2 competitors", "Sole source"] },
  { id: "budget", label: "Budget Alignment", weight: 20, options: ["Unknown budget", "Budget too low", "Close fit", "Within budget"] },
  { id: "timeline", label: "Decision Timeline", weight: 10, options: ["No timeline", "6+ months", "1-3 months", "Under 1 month"] },
  { id: "fit", label: "Solution Fit", weight: 20, options: ["Poor fit", "Partial fit", "Good fit", "Perfect fit"] },
  { id: "champion", label: "Internal Champion", weight: 15, options: ["No contact", "Gatekeeper only", "Influencer", "Decision maker"] },
];

export default function WinRateEstimatorPage() {
  usePageTitle("Win Rate Estimator");
  const [scores, setScores] = useState(Object.fromEntries(FACTORS.map((f) => [f.id, 0])));

  const totalWeight = FACTORS.reduce((s, f) => s + f.weight, 0);
  const weightedScore = FACTORS.reduce((s, f) => s + (scores[f.id] / 3) * f.weight, 0);
  const winRate = Math.round((weightedScore / totalWeight) * 100);

  const ratingLabel = winRate >= 70 ? "Strong" : winRate >= 40 ? "Moderate" : "Low";
  const ratingColor = winRate >= 70 ? "#22c55e" : winRate >= 40 ? "#F0B429" : "#ef4444";

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Win Rate Estimator</h1>
          <p className="tool-subtitle">
            Rate key factors about your opportunity to estimate your proposal win probability — no sign-up required.
          </p>

          <div className="calc-card">
            {FACTORS.map((f) => (
              <label key={f.id} className="calc-label">
                {f.label} <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>({f.weight}% weight)</span>
                <select
                  className="calc-input"
                  value={scores[f.id]}
                  onChange={(e) => setScores((prev) => ({ ...prev, [f.id]: Number(e.target.value) }))}
                >
                  {f.options.map((opt, i) => (
                    <option key={opt} value={i}>{opt}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="calc-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9CA3AF" }}>Estimated Win Rate</div>
              <div style={{ fontSize: "3rem", fontWeight: 800, color: ratingColor }}>{winRate}%</div>
              <div style={{ fontSize: "0.9rem", color: ratingColor, fontWeight: 600 }}>{ratingLabel} Chance</div>
            </div>
            <div className="calc-card">
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9CA3AF", marginBottom: "0.75rem" }}>Recommendations</div>
              <ul style={{ fontSize: "0.85rem", color: "#D1D5DB", paddingLeft: "1rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {FACTORS.filter((f) => scores[f.id] <= 1).map((f) => (
                  <li key={f.id}>Improve <strong>{f.label.toLowerCase()}</strong></li>
                ))}
                {FACTORS.every((f) => scores[f.id] > 1) && <li>All factors look strong — submit with confidence!</li>}
              </ul>
            </div>
          </div>

          <ShareButtons path="/tools/win-rate" text="Win Rate Estimator — Free tool by DoAide Proposals" />

          <div className="calc-card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "#9CA3AF", marginBottom: "0.75rem" }}>Want to track win rates across all your proposals?</p>
            <a href="/" className="btn btn-primary" style={{ display: "inline-block" }}>Sign up free</a>
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Win Rate Estimator",
            description: "Estimate your proposal win probability based on key opportunity factors.",
            url: "https://proposals.doaide.com/tools/win-rate",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            author: { "@type": "Organization", name: "Apprend Technologies", url: "https://doaide.com" },
          }),
        }}
      />
    </div>
  );
}
