import { useState, useEffect } from "react";
import ToolsNav from "../components/ToolsNav";
import ShareButtons from "../components/ShareButtons";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

const API = import.meta.env.VITE_API_URL || "";

const STEPS = ["Template", "Details", "Sections", "Pricing", "Review"];

function StepIndicator({ current, steps }) {
  return (
    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "2rem" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: i <= current ? "#F0B429" : "rgba(255,255,255,0.1)",
              marginBottom: "0.35rem",
              transition: "background 0.2s",
            }}
          />
          <span style={{ fontSize: "0.75rem", color: i <= current ? "#F0B429" : "#6B7280" }}>{s}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProposalBuilderPage() {
  usePageTitle("Free Proposal Builder — Create & Download Professional PDF Proposals");

  const [step, setStep] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [title, setTitle] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const [sections, setSections] = useState([]);
  const [pricingItems, setPricingItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [terms, setTerms] = useState("");
  const [validityDays, setValidityDays] = useState(30);

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/public/seed-templates`)
      .then((r) => r.json())
      .then(setTemplates)
      .catch(() => {});
  }, []);

  const selectTemplate = (t) => {
    setSelectedTemplate(t);
    setTitle(`${t.name} — [Client Name]`);
    setSections(t.sections.map((s) => ({ title: s.title, content: "" })));
    setTerms(t.default_terms || "");
    setStep(1);
  };

  const startBlank = () => {
    setSelectedTemplate(null);
    setTitle("");
    setSections([{ title: "Executive Summary", content: "" }, { title: "Scope of Work", content: "" }, { title: "Deliverables", content: "" }]);
    setTerms("");
    setStep(1);
  };

  const updateSection = (idx, field, value) => {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const addSection = () => setSections((prev) => [...prev, { title: "", content: "" }]);
  const removeSection = (idx) => setSections((prev) => prev.filter((_, i) => i !== idx));

  const addPricingItem = () => setPricingItems((prev) => [...prev, { description: "", quantity: 1, unit_price: 0 }]);
  const updatePricingItem = (idx, field, value) => {
    setPricingItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };
  const removePricingItem = (idx) => setPricingItems((prev) => prev.filter((_, i) => i !== idx));

  const subtotal = pricingItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const discountAmt = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmt;
  const taxAmt = afterDiscount * (taxPercent / 100);
  const total = afterDiscount + taxAmt;

  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const downloadPdf = async () => {
    setDownloading(true);
    track("builder_download_pdf", { template: selectedTemplate?.slug || "blank" });
    try {
      const resp = await fetch(`${API}/api/public/builder/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled Proposal",
          business_name: businessName,
          business_email: businessEmail,
          client_name: clientName,
          client_company: clientCompany,
          client_email: clientEmail,
          sections: sections.filter((s) => s.title || s.content),
          pricing_items: pricingItems.filter((i) => i.description),
          discount_percent: discountPercent,
          tax_percent: taxPercent,
          terms,
          validity_days: validityDays,
        }),
      });
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "proposal.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed. Please try again.");
    }
    setDownloading(false);
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 720 }}>
          <h1 className="tool-title">Proposal Builder</h1>
          <p className="tool-subtitle">
            Build a professional proposal step-by-step and download it as a PDF. No sign-up required.
          </p>

          <StepIndicator current={step} steps={STEPS} />

          {step === 0 && (
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "1rem" }}>Choose a Starting Template</h2>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {templates.map((t) => (
                  <button key={t.slug} className="calc-card" onClick={() => selectTemplate(t)} style={{ cursor: "pointer", textAlign: "left", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <strong style={{ color: "#fff", fontSize: "1rem" }}>{t.name}</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#9CA3AF" }}>{t.description}</p>
                  </button>
                ))}
                <button className="calc-card" onClick={startBlank} style={{ cursor: "pointer", textAlign: "left", border: "1px dashed rgba(240,180,41,0.4)" }}>
                  <strong style={{ color: "#F0B429", fontSize: "1rem" }}>Start from Scratch</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#9CA3AF" }}>Build your own proposal with custom sections.</p>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="calc-card">
              <h2 style={{ fontSize: "1.1rem", color: "#fff", margin: "0 0 1rem" }}>Proposal Details</h2>
              <label className="calc-label">
                Proposal Title
                <input className="calc-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Website Redesign Proposal" />
              </label>
              <label className="calc-label">
                Your Business Name
                <input className="calc-input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your company or name" />
              </label>
              <label className="calc-label">
                Your Email
                <input className="calc-input" type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="you@company.com" />
              </label>
              <label className="calc-label">
                Client Name
                <input className="calc-input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client contact name" />
              </label>
              <label className="calc-label">
                Client Company
                <input className="calc-input" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="Client company name" />
              </label>
              <label className="calc-label">
                Client Email
                <input className="calc-input" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@company.com" />
              </label>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button className="btn" onClick={() => setStep(0)} style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#9CA3AF" }}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Sections</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "1rem" }}>Proposal Sections</h2>
              {sections.map((s, i) => (
                <div key={i} className="calc-card" style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <input
                      className="calc-input"
                      value={s.title}
                      onChange={(e) => updateSection(i, "title", e.target.value)}
                      placeholder="Section title"
                      style={{ fontWeight: 600, fontSize: "1rem", marginTop: 0 }}
                    />
                    {sections.length > 1 && (
                      <button onClick={() => removeSection(i)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}>
                        Remove
                      </button>
                    )}
                  </div>
                  {selectedTemplate?.sections?.[i]?.hint && (
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 0.5rem", fontStyle: "italic" }}>
                      Tip: {selectedTemplate.sections[i].hint}
                    </p>
                  )}
                  <textarea
                    className="calc-input"
                    rows={4}
                    value={s.content}
                    onChange={(e) => updateSection(i, "content", e.target.value)}
                    placeholder="Write the content for this section..."
                    style={{ resize: "vertical", marginTop: 0 }}
                  />
                </div>
              ))}
              <button onClick={addSection} style={{ background: "none", border: "1px dashed rgba(240,180,41,0.4)", color: "#F0B429", padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>
                + Add Section
              </button>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button className="btn" onClick={() => setStep(1)} style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#9CA3AF" }}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Pricing</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "1rem" }}>Pricing Table</h2>
              <div className="calc-card">
                {pricingItems.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "end" }}>
                    <label className="calc-label" style={{ marginBottom: 0 }}>
                      {i === 0 && "Description"}
                      <input className="calc-input" value={item.description} onChange={(e) => updatePricingItem(i, "description", e.target.value)} placeholder="Line item" />
                    </label>
                    <label className="calc-label" style={{ marginBottom: 0 }}>
                      {i === 0 && "Qty"}
                      <input className="calc-input" type="number" min="1" value={item.quantity} onChange={(e) => updatePricingItem(i, "quantity", Number(e.target.value))} />
                    </label>
                    <label className="calc-label" style={{ marginBottom: 0 }}>
                      {i === 0 && "Unit Price"}
                      <input className="calc-input" type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updatePricingItem(i, "unit_price", Number(e.target.value))} />
                    </label>
                    <button onClick={() => removePricingItem(i)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.5rem", fontSize: "1.1rem", marginTop: i === 0 ? "1.1rem" : 0 }}>
                      &times;
                    </button>
                  </div>
                ))}
                <button onClick={addPricingItem} style={{ background: "none", border: "1px dashed rgba(240,180,41,0.4)", color: "#F0B429", padding: "0.4rem 1rem", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem" }}>
                  + Add Line Item
                </button>

                {pricingItems.length > 0 && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
                      <label className="calc-label">
                        Discount (%)
                        <input className="calc-input" type="number" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} />
                      </label>
                      <label className="calc-label">
                        Tax Rate (%)
                        <input className="calc-input" type="number" min="0" max="100" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} />
                      </label>
                    </div>
                    <div className="calc-result">
                      <div className="calc-result-row"><span>Subtotal</span><strong>${fmt(subtotal)}</strong></div>
                      {discountPercent > 0 && <div className="calc-result-row"><span>Discount ({discountPercent}%)</span><strong style={{ color: "#ef4444" }}>-${fmt(discountAmt)}</strong></div>}
                      {taxPercent > 0 && <div className="calc-result-row"><span>Tax ({taxPercent}%)</span><strong>+${fmt(taxAmt)}</strong></div>}
                      <div className="calc-result-row calc-total"><span>Total</span><strong>${fmt(total)}</strong></div>
                    </div>
                  </>
                )}
              </div>

              <div className="calc-card" style={{ marginTop: "0.75rem" }}>
                <label className="calc-label">
                  Terms & Conditions
                  <textarea className="calc-input" rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Payment terms, revision policy, cancellation, etc." style={{ resize: "vertical", marginTop: "0.4rem" }} />
                </label>
                <label className="calc-label">
                  Validity (days)
                  <input className="calc-input" type="number" min="1" max="365" value={validityDays} onChange={(e) => setValidityDays(Number(e.target.value))} />
                </label>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button className="btn" onClick={() => setStep(2)} style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#9CA3AF" }}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(4)}>Next: Review</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "1rem" }}>Review & Download</h2>
              <div className="calc-card">
                <h3 style={{ color: "#F0B429", margin: "0 0 0.5rem", fontSize: "1.2rem" }}>{title || "Untitled Proposal"}</h3>
                {businessName && <p style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", color: "#9CA3AF" }}>From: {businessName} {businessEmail && `(${businessEmail})`}</p>}
                {(clientName || clientCompany) && <p style={{ margin: "0 0 1rem", fontSize: "0.9rem", color: "#9CA3AF" }}>To: {clientName} {clientCompany && `at ${clientCompany}`}</p>}

                {sections.filter((s) => s.title).map((s, i) => (
                  <div key={i} style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#fff", fontSize: "0.95rem" }}>{s.title}</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#9CA3AF", whiteSpace: "pre-wrap" }}>{s.content || "(empty)"}</p>
                  </div>
                ))}

                {pricingItems.length > 0 && (
                  <div style={{ marginTop: "1rem", borderTop: "1px solid #2A2A2D", paddingTop: "1rem" }}>
                    <strong style={{ color: "#fff" }}>Pricing</strong>
                    {pricingItems.filter((i) => i.description).map((item, i) => (
                      <div key={i} className="calc-result-row" style={{ fontSize: "0.9rem" }}>
                        <span>{item.description} (x{item.quantity})</span>
                        <strong>${fmt(item.quantity * item.unit_price)}</strong>
                      </div>
                    ))}
                    <div className="calc-result-row calc-total"><span>Total</span><strong>${fmt(total)}</strong></div>
                  </div>
                )}

                {terms && (
                  <div style={{ marginTop: "1rem", borderTop: "1px solid #2A2A2D", paddingTop: "1rem" }}>
                    <strong style={{ color: "#fff", fontSize: "0.9rem" }}>Terms</strong>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#9CA3AF" }}>{terms}</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button className="btn" onClick={() => setStep(3)} style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#9CA3AF" }}>Back</button>
                <button className="btn btn-primary" onClick={downloadPdf} disabled={downloading} style={{ flex: 1 }}>
                  {downloading ? "Generating PDF..." : "Download PDF"}
                </button>
              </div>

              <ShareButtons path="/builder" text="Free Proposal Builder — create and download professional PDF proposals with DoAide" />
            </div>
          )}

          <section className="tool-info">
            <h2>Why Use the Proposal Builder?</h2>
            <p>
              Creating professional proposals shouldn't require expensive software or design skills.
              Our free Proposal Builder walks you through each section, calculates your pricing
              automatically, and generates a polished PDF ready to send to clients.
            </p>
            <h3>Works for Any Industry</h3>
            <p>
              Choose from consulting, software development, marketing, or freelance templates — or start
              from scratch with your own structure. Each template includes writing hints to help you
              craft compelling content.
            </p>
          </section>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Proposal Builder",
            description: "Create professional business proposals step-by-step and download as PDF. No sign-up required.",
            url: "https://proposals.doaide.com/builder",
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
