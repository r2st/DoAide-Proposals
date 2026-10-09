import { Link } from "react-router-dom";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";

const TOOLS = [
  { path: "/builder", title: "Proposal Builder", description: "Build a proposal step-by-step and download as a professional PDF.", icon: "📋" },
  { path: "/generator", title: "Proposal Generator", description: "Generate a professional proposal outline with AI assistance.", icon: "📝" },
  { path: "/calculator", title: "Cost Estimator", description: "Estimate project costs with built-in formulas.", icon: "🧮" },
  { path: "/templates-gallery", title: "Proposal Templates", description: "Browse free proposal templates for various industries.", icon: "📁" },
  { path: "/tools/win-rate", title: "Win Rate Estimator", description: "Estimate your proposal win probability based on key factors.", icon: "🎯" },
  { path: "/tools/pricing-calculator", title: "Pricing Calculator", description: "Calculate project pricing with margins, discounts, and taxes.", icon: "💰" },
  { path: "/tools/pricing-table", title: "Pricing Table Builder", description: "Build line-item pricing tables with tax and discount calculations.", icon: "📊" },
];

export default function ToolsIndexPage() {
  usePageTitle("Free Proposal Tools — No Sign-up Required");
  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Free Proposal Tools</h1>
          <p className="tool-subtitle">
            Create proposals, estimate costs, and improve your win rate — no sign-up required.
          </p>
          <div className="tools-grid">
            {TOOLS.map((t) => (
              <Link key={t.path} to={t.path} className="tool-card">
                <span className="tool-card-icon">{t.icon}</span>
                <h2 className="tool-card-title">{t.title}</h2>
                <p className="tool-card-desc">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Proposal Tools",
            description: "Free proposal tools — generator, cost estimator, win rate calculator, and templates.",
            url: "https://proposals.doaide.com/tools",
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
