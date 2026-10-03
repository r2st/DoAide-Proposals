import { Link, Outlet } from "react-router-dom";
import ProposalWritingGuide from "./blog/ProposalWritingGuide";
import PricingStrategies from "./blog/PricingStrategies";
import ClientManagement from "./blog/ClientManagement";

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
