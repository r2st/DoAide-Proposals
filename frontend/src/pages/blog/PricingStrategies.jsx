import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function PricingStrategies() {
  usePageTitle("Pricing Strategies for Service-Based Businesses");

  return (
    <article className="blog-article">
      <h1>Pricing Strategies for Service-Based Businesses</h1>
      <p className="blog-meta">Updated October 2026 · 7 min read</p>

      <section>
        <h2>Why Pricing Is Hard for Service Businesses</h2>
        <p>
          Unlike products with a fixed cost of goods, services are harder to price because the
          primary input is time and expertise — both of which are subjective. Charge too little
          and you burn out. Charge too much and you lose deals. The right pricing strategy depends
          on your market, your positioning, and how you deliver value.
        </p>
      </section>

      <section>
        <h2>Three Core Pricing Models</h2>

        <h3>1. Hourly Billing</h3>
        <p>
          The simplest model: track your hours and bill at an agreed rate. Best for ongoing
          retainers, maintenance work, or projects where scope is genuinely unpredictable.
          The downside is that it punishes efficiency — the faster you work, the less you earn.
        </p>

        <h3>2. Fixed-Price / Project-Based</h3>
        <p>
          Quote a flat fee for a defined scope of work. Clients love the predictability, and you
          benefit from efficiency. The risk is scope creep — protect yourself with a clear scope
          document and a change-order process.
        </p>

        <h3>3. Value-Based Pricing</h3>
        <p>
          Price based on the outcome you deliver, not the hours you spend. If your marketing
          campaign will generate $500K in revenue, a $50K fee is a bargain. This requires
          understanding your client's business deeply and being confident in your results.
        </p>
      </section>

      <section>
        <h2>How to Calculate Your Rate</h2>
        <ol>
          <li>Determine your annual income target</li>
          <li>Add overhead costs (tools, insurance, taxes, office)</li>
          <li>Divide by billable hours (typically 1,200–1,600 per year)</li>
          <li>Add a profit margin (15–25%)</li>
          <li>Round up to a clean number</li>
        </ol>
        <p>
          Use our free <Link to="/calculator">Project Cost Estimator</Link> to model different
          team sizes, durations, and rates instantly.
        </p>
      </section>

      <section>
        <h2>Presenting Pricing in Proposals</h2>
        <ul>
          <li>Always anchor with value before revealing price</li>
          <li>Offer 2–3 tiers (Good / Better / Best) to give the client choice</li>
          <li>Break costs into line items so nothing feels hidden</li>
          <li>Include payment terms and what triggers each payment</li>
          <li>Frame the investment relative to the expected ROI</li>
        </ul>
      </section>

      <section>
        <h2>Price With Confidence Using DoAide</h2>
        <p>
          DoAide Proposals includes a smart pricing engine with itemized quotes, tax calculations,
          and discount logic. Generate proposals with professional pricing tables in minutes.
        </p>
        <p>
          <Link to="/">Start free with DoAide Proposals →</Link>
        </p>
      </section>
    </article>
  );
}
