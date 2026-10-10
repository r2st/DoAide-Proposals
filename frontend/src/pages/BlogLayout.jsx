import { Link, Outlet } from "react-router-dom";
import ProposalWritingGuide from "./blog/ProposalWritingGuide";
import PricingStrategies from "./blog/PricingStrategies";
import ClientManagement from "./blog/ClientManagement";
import WinningProposalStructure from "./blog/WinningProposalStructure";
import ProposalFollowUp from "./blog/ProposalFollowUp";
import BusinessProposalFormat from "./blog/BusinessProposalFormat";
import ProjectProposalGuide from "./blog/ProjectProposalGuide";
import GovernmentTenderProposal from "./blog/GovernmentTenderProposal";

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
  {
    slug: "business-proposal-format-india",
    title: "Business Proposal Format: Professional Template for Indian Companies",
    description: "A complete guide to the professional business proposal format used by successful Indian companies — structure, sections, formatting tips, and free templates.",
    component: BusinessProposalFormat,
  },
  {
    slug: "winning-project-proposal-guide",
    title: "How to Write a Winning Project Proposal: Step-by-Step Guide",
    description: "Learn how to write a project proposal that gets approved — from defining objectives and scope to budgeting, risk analysis, and professional formatting.",
    component: ProjectProposalGuide,
  },
  {
    slug: "government-tender-proposal-msme",
    title: "Government Tender Proposal Writing: Tips for Indian MSMEs",
    description: "A practical guide for Indian MSMEs on writing government tender proposals — from GeM registration and EMD to technical bids, pricing, and common disqualification traps.",
    component: GovernmentTenderProposal,
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
