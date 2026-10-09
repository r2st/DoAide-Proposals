import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function WinningProposalStructure() {
  usePageTitle("The Perfect Proposal Structure: A Section-by-Section Breakdown");

  return (
    <article className="blog-article">
      <h1>The Perfect Proposal Structure: A Section-by-Section Breakdown</h1>
      <p className="blog-meta">Updated October 2026 &middot; 10 min read</p>

      <section>
        <h2>Why Structure Matters More Than You Think</h2>
        <p>
          Most proposals fail not because the ideas are bad, but because the structure is wrong.
          Decision-makers scan proposals the same way they scan resumes &mdash; they look for specific
          information in predictable places. If your pricing is buried on page 12 or your executive
          summary reads like a company brochure, you lose before they read a word of your solution.
        </p>
        <p>
          A well-structured proposal does three things: it builds confidence that you understand the
          problem, it presents your solution in a logical sequence, and it makes it easy to say yes.
          Here is the section-by-section blueprint that consistently wins.
        </p>
      </section>

      <section>
        <h2>1. Cover Page</h2>
        <p>
          Keep it clean: proposal title, client name, your company name, date, and contact info.
          No clip art, no stock photos, no mission statements. The cover page exists to orient
          the reader, not to impress them. If your brand has a logo, use it once. White space is
          your friend.
        </p>
      </section>

      <section>
        <h2>2. Executive Summary</h2>
        <p>
          This is the most important section. Write it last, but put it first. In 200&ndash;300
          words, answer three questions: What is the client's problem? What will you do about it?
          What outcome can they expect?
        </p>
        <p>
          Avoid starting with "We are a leading provider of..." Nobody cares about your company
          history in the executive summary. Start with the client's pain point. Show that you
          understand their world before you pitch your solution.
        </p>
      </section>

      <section>
        <h2>3. Problem Statement</h2>
        <p>
          Dedicate a section to articulating the problem in the client's own language. Reference
          specifics from your discovery calls or their RFP. This demonstrates that your proposal
          is custom, not copy-pasted. The more precisely you define the problem, the more
          credible your solution becomes.
        </p>
      </section>

      <section>
        <h2>4. Proposed Solution</h2>
        <p>
          Describe what you will do, broken into clear phases or workstreams. For each phase,
          explain the activities, who is involved, and what the client receives at the end.
          Use plain language &mdash; if a non-technical stakeholder cannot understand your solution,
          simplify it.
        </p>
        <p>
          Avoid listing features. Instead, connect every activity to a client outcome. "We will
          conduct user interviews" becomes "We will interview 15 of your customers to identify
          the three biggest friction points in the current checkout flow."
        </p>
      </section>

      <section>
        <h2>5. Deliverables & Timeline</h2>
        <p>
          List every deliverable with a target completion date. Use a table or timeline graphic
          for complex projects. Be specific: "Brand guidelines document (20&ndash;30 pages)"
          is better than "Brand deliverables." Clients want to know exactly what they are buying.
        </p>
        <p>
          Include milestones where the client reviews and approves work before you proceed.
          This builds trust and prevents scope disputes later.
        </p>
      </section>

      <section>
        <h2>6. Pricing</h2>
        <p>
          Break costs down by deliverable, phase, or role. A single lump sum feels opaque
          and invites negotiation. An itemized breakdown shows the client where their money goes
          and makes it harder to argue that the price is arbitrary.
        </p>
        <p>
          Include payment terms: how much upfront, what triggers subsequent payments, and
          net terms. If you offer a discount for early payment or annual commitment, state it
          clearly.
        </p>
      </section>

      <section>
        <h2>7. Terms & Conditions</h2>
        <p>
          Cover the essentials: revision limits, intellectual property ownership, confidentiality,
          cancellation policy, and post-delivery support. Clear terms prevent disputes and show
          professionalism. If your terms are longer than one page, you are over-lawyering the proposal.
        </p>
      </section>

      <section>
        <h2>8. About / Team</h2>
        <p>
          Put credentials at the end, not the beginning. By this point, the client already
          understands your solution and pricing &mdash; now they want to know who will do the work.
          Include brief bios of key team members with relevant project experience. Skip the
          company founding story.
        </p>
      </section>

      <section>
        <h2>9. Next Steps / Call to Action</h2>
        <p>
          End with a clear call to action: "Sign and return this proposal by October 25 to
          begin on November 1." Include signing instructions and contact info. Do not end
          with "We look forward to hearing from you" &mdash; that is a hope, not a next step.
        </p>
      </section>

      <section>
        <h2>Common Structure Mistakes</h2>
        <ul>
          <li>Putting company history before the client's problem</li>
          <li>Mixing pricing into multiple sections instead of one clear table</li>
          <li>Writing 20 pages when 8 would do &mdash; brevity signals confidence</li>
          <li>Using jargon the client has not used themselves</li>
          <li>Forgetting a clear call to action at the end</li>
        </ul>
      </section>

      <section>
        <h2>Build Your Proposal in Minutes</h2>
        <p>
          DoAide Proposals gives you pre-built templates with this exact structure. Choose
          consulting, software development, marketing, or freelance &mdash; fill in your content,
          add pricing, and download a professional PDF. No signup required for the{" "}
          <Link to="/builder">free Proposal Builder</Link>.
        </p>
        <p>
          <Link to="/">Try DoAide Proposals free &rarr;</Link>
        </p>
      </section>
    </article>
  );
}
