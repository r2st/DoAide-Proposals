import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProposalFollowUp() {
  usePageTitle("How to Follow Up on a Proposal Without Being Annoying");

  return (
    <article className="blog-article">
      <h1>How to Follow Up on a Proposal Without Being Annoying</h1>
      <p className="blog-meta">Updated October 2026 &middot; 7 min read</p>

      <section>
        <h2>The Follow-Up Problem</h2>
        <p>
          You sent a great proposal. The client said they would review it. A week passes, then
          two. You do not want to seem desperate, but you also cannot afford to let the deal
          die in silence. The follow-up is where most proposals are actually won or lost &mdash;
          and most people get it wrong.
        </p>
        <p>
          The data is clear: 80% of deals require at least five follow-ups after the initial
          proposal, but 44% of salespeople give up after just one. The gap between persistence
          and pestering is smaller than you think &mdash; and it is entirely about how you follow up,
          not how often.
        </p>
      </section>

      <section>
        <h2>The Follow-Up Timeline</h2>

        <h3>Day 1: Confirmation</h3>
        <p>
          Send a brief email confirming the proposal was received. Keep it two sentences:
          "Hi [Name], I have sent over the proposal for [project]. Let me know if you have any
          questions &mdash; happy to walk through it whenever works for you."
        </p>

        <h3>Day 3&ndash;5: Add Value</h3>
        <p>
          Do not ask "Did you see my proposal?" Instead, add something useful: a relevant
          case study, an article about their industry challenge, or a quick insight you thought
          of since submitting. This keeps you top of mind without sounding needy.
        </p>

        <h3>Day 7&ndash;10: Check In</h3>
        <p>
          Now you can ask directly. Frame it around their timeline: "I wanted to check if
          you had a chance to review the proposal. Is there anything you need from my side
          to move forward?" This respects their process while nudging progress.
        </p>

        <h3>Day 14&ndash;21: Create Urgency</h3>
        <p>
          If the proposal has a validity period (it should), reference it: "The pricing in
          the proposal is valid through [date]. If the timeline has shifted, I am happy to
          adjust &mdash; just let me know." This is not pressure; it is professional boundary-setting.
        </p>

        <h3>Day 30+: The Breakup Email</h3>
        <p>
          If you have followed up three to four times with no response, send a closing email:
          "I have not heard back, so I will assume the timing is not right. If things change,
          the door is open &mdash; just reply to this thread." This often triggers a response because
          people hate losing options.
        </p>
      </section>

      <section>
        <h2>What to Say (and What Not to Say)</h2>

        <h3>Good Follow-Up Lines</h3>
        <ul>
          <li>"I thought of something that might help with [their specific challenge]..."</li>
          <li>"A quick update &mdash; we just wrapped a similar project for [company] and the results were [specific outcome]."</li>
          <li>"Is there someone else on your team I should loop in?"</li>
          <li>"Would it help to schedule a 15-minute call to walk through the pricing section?"</li>
        </ul>

        <h3>Lines That Kill Deals</h3>
        <ul>
          <li>"Just following up..." (says nothing, adds no value)</li>
          <li>"I wanted to circle back..." (corporate speak that signals you are on autopilot)</li>
          <li>"Have you made a decision?" (puts them on the spot)</li>
          <li>"I really need to know by Friday" (your urgency is not their problem)</li>
        </ul>
      </section>

      <section>
        <h2>Channel Matters</h2>
        <p>
          If the original conversation happened over email, follow up over email. If you
          have a relationship on LinkedIn or Slack, a casual message there can break through
          inbox noise. Phone calls work for high-value deals where you have an existing
          relationship &mdash; avoid cold-calling a prospect who has gone quiet.
        </p>
        <p>
          Mix channels across follow-ups. First email, then LinkedIn message, then email
          again. Multi-channel follow-up has a 25% higher response rate than single-channel.
        </p>
      </section>

      <section>
        <h2>Track Everything</h2>
        <p>
          Use a CRM or proposal tool that tells you when the client opens your proposal.
          If you can see that they viewed it three times in the last week, you know they
          are interested but stuck on something &mdash; your follow-up should address potential
          objections rather than ask if they have read it.
        </p>
        <p>
          DoAide Proposals shows you exactly when clients view your proposals and which
          sections they spend time on. This turns guesswork into strategy.
        </p>
      </section>

      <section>
        <h2>When to Stop</h2>
        <p>
          After four to five follow-ups with zero response, stop. Send the breakup email and
          move on. Chasing a dead lead costs more than finding a new one. But add them to a
          quarterly check-in list &mdash; timing changes, budgets open up, and the person who ignored
          you in Q2 might need you urgently in Q4.
        </p>
      </section>

      <section>
        <h2>Automate the Follow-Up</h2>
        <p>
          With <Link to="/">DoAide Proposals</Link>, you get automatic view tracking and
          status updates so you always know where each proposal stands. Pair it with the{" "}
          <Link to="/builder">free Proposal Builder</Link> to create proposals that are
          structured for easy client review &mdash; reducing the need for follow-ups in the first
          place.
        </p>
        <p>
          <Link to="/">Start using DoAide Proposals free &rarr;</Link>
        </p>
      </section>
    </article>
  );
}
