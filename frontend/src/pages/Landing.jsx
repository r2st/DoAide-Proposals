import { useState } from "react";
import { Link } from "react-router-dom";

const DOAIDE_PRODUCTS = [
  { name: "Proposals", url: "https://proposals.doaide.com" },
  { name: "Scheduler", url: "https://scheduler.doaide.com" },
  { name: "Payroll", url: "https://payroll.doaide.com" },
  { name: "Inventory", url: "https://inventory.doaide.com" },
  { name: "Support", url: "https://support.doaide.com" },
  { name: "Analytics", url: "https://analytics-app.doaide.com" },
  { name: "GST", url: "https://gst.doaide.com" },
  { name: "Desk", url: "https://desk.doaide.com" },
  { name: "Jobs", url: "https://job.doaide.com" },
  { name: "409A", url: "https://409a.doaide.com" },
  { name: "Pulse", url: "https://pulse.doaide.com" },
  { name: "Med", url: "https://med.doaide.com" },
  { name: "Realty", url: "https://realty.doaide.com" },
  { name: "Reach", url: "https://reach.doaide.com" },
  { name: "Trade", url: "https://trade.doaide.com" },
];

function RobotFace({ size = 32, color = "#F0B429" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <line x1="16" y1="6" x2="16" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="1.5" r="1.5" fill={color} />
      <rect x="5" y="6" width="22" height="17" rx="5" fill={color} />
      <ellipse cx="11" cy="13" rx="2.5" ry="3" fill="#0A0A0B" />
      <ellipse cx="21" cy="13" rx="2.5" ry="3" fill="#0A0A0B" />
      <circle cx="11.5" cy="12.5" r="1" fill={color} opacity="0.6" />
      <circle cx="21.5" cy="12.5" r="1" fill={color} opacity="0.6" />
      <path d="M12 19Q16 22 20 19" stroke="#0A0A0B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <rect x="1" y="10" width="4" height="5" rx="2" fill={color} opacity="0.8" />
      <rect x="27" y="10" width="4" height="5" rx="2" fill={color} opacity="0.8" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "AI-Powered Generation",
    desc: "Generate professional proposals from a brief using AI. Save hours of writing and focus on closing deals.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
    ),
  },
  {
    title: "Template Builder",
    desc: "Create reusable templates with custom sections, pricing tables, and terms. Start every proposal from a proven structure.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
    ),
  },
  {
    title: "Client Management",
    desc: "Track all your clients, proposal history, and engagement in one place. Know who opened what and when.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
    ),
  },
  {
    title: "Smart Pricing Engine",
    desc: "Itemized quotes with tax calculation, discount logic, and multiple currencies. Look professional every time.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
    ),
  },
  {
    title: "PDF Export",
    desc: "Export polished, branded proposals as professional PDF documents. Ready to send or print in seconds.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    ),
  },
  {
    title: "E-Signatures",
    desc: "Clients can view, accept, or reject proposals online with a digital signature. No app download needed.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F0B429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
    ),
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Choose a template", desc: "Pick from ready-made templates or create your own with custom sections, pricing tables, and terms." },
  { step: "2", title: "AI writes your proposal", desc: "Describe the project in a few lines. AI generates professional content including scope, deliverables, and timeline." },
  { step: "3", title: "Send & get signed", desc: "Share a secure link with your client. They review, comment, and sign — all in the browser." },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "For freelancers getting started",
    features: ["5 proposals/month", "3 templates", "PDF export", "Email support"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For growing businesses",
    features: ["Unlimited proposals", "Custom templates", "E-signatures", "Client analytics", "Priority support"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    desc: "For teams that close at scale",
    features: ["Everything in Pro", "Team collaboration", "API access", "Custom branding", "Dedicated support"],
    cta: "Contact Sales",
  },
];

const TESTIMONIALS = [
  { name: "Sarah T.", role: "Agency Owner", quote: "DoAide Proposals cut our proposal creation time from 3 hours to 15 minutes. The AI-generated content is surprisingly good." },
  { name: "James K.", role: "Consultant", quote: "The e-signature feature alone saved us from juggling three different tools. Clients love the clean proposal pages." },
  { name: "Priya M.", role: "Sales Lead", quote: "We went from sending 5 proposals a week to 20. More proposals, more wins. The ROI was instant." },
];

const FAQ_ITEMS = [
  { q: "What types of proposals can I create?", a: "Business proposals, project quotes, consulting offers, freelance contracts, and more. Any document that needs professional formatting and client approval." },
  { q: "How does the AI generation work?", a: "Provide a brief description of the project and client. Our AI generates professional proposal content including scope, deliverables, timeline, and pricing — ready to review and send." },
  { q: "Can clients sign proposals digitally?", a: "Yes. Send a secure link and clients can review, comment, and sign directly in their browser. No app download needed. All signatures include an audit trail." },
  { q: "Is DoAide Proposals free?", a: "Yes. The Free plan includes 5 proposals per month with PDF export. Upgrade to Pro for unlimited proposals and e-signatures. No credit card required to start." },
  { q: "Can I customize proposal branding?", a: "Pro and Enterprise plans support custom logos, colors, fonts, and domains for a fully branded client experience." },
  { q: "How secure are my proposals?", a: "All data is encrypted in transit and at rest. Signed proposals are tamper-evident with audit trails. Your client data never leaves our secure infrastructure." },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="py-20 px-4 sm:px-6" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <dt>
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  aria-expanded={openIndex === i}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {item.q}
                  <span className="ml-4 text-[#F0B429] text-xl flex-shrink-0">{openIndex === i ? "−" : "+"}</span>
                </button>
              </dt>
              {openIndex === i && (
                <dd className="px-5 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.a}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B]">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <a href="https://doaide.com" className="flex items-center gap-2.5 no-underline">
          <RobotFace size={28} color="#F0B429" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            DoAide <span className="text-[#F0B429]">Proposals</span>
          </span>
        </a>
        <nav className="flex items-center gap-4">
          <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors no-underline">
            Pricing
          </Link>
          <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors no-underline">
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-[#F0B429] text-[#0A0A0B] text-sm font-semibold rounded-lg hover:bg-[#D4A017] transition-colors no-underline"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main>
        <section className="py-20 sm:py-28 px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Professional Proposals,{" "}
            <span className="text-[#F0B429]">Powered by AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create, send, and track beautiful business proposals in minutes.
            AI handles the writing while you close deals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-[#F0B429] text-[#0A0A0B] text-lg font-semibold rounded-lg hover:bg-[#D4A017] transition-colors no-underline"
            >
              Start Free
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-lg rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline"
            >
              View Pricing
            </Link>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="features-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Everything You Need to Win More Business
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-14 max-w-xl mx-auto">
              From AI-powered writing to e-signatures, DoAide Proposals handles the entire proposal lifecycle.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111113] hover:border-[#F0B429]/30 transition-colors"
                >
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#111113]" aria-labelledby="how-heading">
          <div className="max-w-4xl mx-auto">
            <h2 id="how-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-14">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F0B429] text-[#0A0A0B] text-xl font-bold flex items-center justify-center mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6" aria-labelledby="pricing-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="pricing-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-14">
              Start free. Upgrade when you need more.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-xl border ${
                    plan.featured
                      ? "border-[#F0B429] ring-2 ring-[#F0B429]/20"
                      : "border-gray-200 dark:border-gray-700"
                  } bg-white dark:bg-[#0A0A0B]`}
                >
                  {plan.featured && (
                    <span className="text-xs font-semibold text-[#F0B429] uppercase tracking-wide">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.desc}</p>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-[#F0B429] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors no-underline ${
                      plan.featured
                        ? "bg-[#F0B429] text-[#0A0A0B] hover:bg-[#D4A017]"
                        : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#111113]" aria-labelledby="testimonials-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-14">
              Trusted by Businesses Worldwide
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <blockquote key={t.name} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B]">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer>
                    <strong className="text-gray-900 dark:text-white">{t.name}</strong>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">{t.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 bg-gray-50 dark:bg-[#111113]" aria-labelledby="tools-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="tools-heading" className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Free Proposal Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-14 max-w-xl mx-auto">
              No signup required. Use these tools instantly to plan your next project.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link to="/builder" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#F0B429]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F4CB;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#F0B429] transition-colors">Proposal Builder</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Build a proposal step-by-step and download as a professional PDF.</p>
              </Link>
              <Link to="/generator" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#F0B429]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F4DD;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#F0B429] transition-colors">Proposal Generator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Generate a structured proposal outline instantly from your project details.</p>
              </Link>
              <Link to="/tools/pricing-table" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#F0B429]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F4CA;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#F0B429] transition-colors">Pricing Table Builder</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Build line-item pricing tables with tax and discount calculations.</p>
              </Link>
              <Link to="/templates-gallery" className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0B] hover:border-[#F0B429]/50 transition-colors no-underline group">
                <div className="text-2xl mb-3">&#x1F4C4;</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#F0B429] transition-colors">Template Gallery</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Browse proposal templates for consulting, development, marketing, and more.</p>
              </Link>
            </div>
          </div>
        </section>

        <FaqSection />

        <section className="py-20 px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Win More Business?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            Start creating professional proposals today. Free forever for up to 5 proposals per month.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3.5 bg-[#F0B429] text-[#0A0A0B] text-lg font-semibold rounded-lg hover:bg-[#D4A017] transition-colors no-underline"
          >
            Get Started Free
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <Link to="/pricing" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline">Pricing</Link>
                <a href="#features-heading" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline" onClick={(e) => { e.preventDefault(); document.getElementById("features-heading")?.scrollIntoView({ behavior: "smooth" }); }}>Features</a>
                <a href="#faq-heading" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline" onClick={(e) => { e.preventDefault(); document.getElementById("faq-heading")?.scrollIntoView({ behavior: "smooth" }); }}>FAQ</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Free Tools</h4>
              <div className="space-y-2 text-sm">
                <Link to="/builder" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline">Proposal Builder</Link>
                <Link to="/generator" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline">Proposal Generator</Link>
                <Link to="/tools/pricing-table" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline">Pricing Table Builder</Link>
                <Link to="/templates-gallery" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline">Template Gallery</Link>
                <Link to="/blog" className="block text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline">Blog</Link>
              </div>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">DoAide Products</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {DOAIDE_PRODUCTS.map((p) => (
                  <a key={p.name} href={p.url} className="text-gray-500 dark:text-gray-400 hover:text-[#F0B429] no-underline">{p.name}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
            <a href="https://doaide.com" className="flex items-center gap-2 no-underline">
              <RobotFace size={16} color="#F0B429" />
              <span className="text-sm text-gray-500 dark:text-gray-400">doaide.com</span>
            </a>
            <span className="text-sm text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} DoAide. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
