import { Link, Outlet } from "react-router-dom";
import ProposalWritingGuide from "./blog/ProposalWritingGuide";
import PricingStrategies from "./blog/PricingStrategies";
import ClientManagement from "./blog/ClientManagement";
import WinningProposalStructure from "./blog/WinningProposalStructure";
import ProposalFollowUp from "./blog/ProposalFollowUp";

const ARTICLES = [
  {
    slug: "how-to-write-business-proposal",
    title: "How to Write a Business Proposal That Wins",
    description: "A step-by-step guide to writing proposals that stand out — from executive summary to pricing and follow-up.",
    component: ProposalWritingGuide,
  },
  {
    slug: "pricing-strategies-service-business",
    title: "Pricing Strategies for Service-Based Businesses",
    description: "Learn how to price your services confidently with value-based, hourly, and retainer models explained.",
    component: PricingStrategies,
  },
  {
    slug: "client-management-best-practices",
    title: "Client Management Best Practices for Agencies",
    description: "Practical tips for managing client relationships, setting expectations, and reducing churn.",
    component: ClientManagement,
  },
  {
    slug: "proposal-structure-breakdown",
    title: "The Perfect Proposal Structure: A Section-by-Section Breakdown",
    description: "A detailed blueprint for structuring proposals that win — cover page to call to action, with common mistakes to avoid.",
    component: WinningProposalStructure,
  },
  {
    slug: "proposal-follow-up-guide",
    title: "How to Follow Up on a Proposal Without Being Annoying",
    description: "The follow-up timeline, what to say at each stage, and when to stop — backed by sales data.",
    component: ProposalFollowUp,
  },
];

export { ARTICLES };

export default function BlogLayout() {
  return (
    <div className="blog-layout">
      <header className="blog-header">
        <Link to="/" className="blog-home-link">← Back to DoAide Proposals</Link>
        <h1 className="blog-title">DoAide Proposals Blog</h1>
        <p className="blog-subtitle">Guides and resources for winning more business</p>
      </header>
      <Outlet />
    </div>
  );
}

export function BlogIndex() {
  return (
    <div className="blog-index">
      {ARTICLES.map((a) => (
        <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-card">
          <h2>{a.title}</h2>
          <p>{a.description}</p>
          <span className="blog-read-more">Read more →</span>
        </Link>
      ))}
    </div>
  );
}
