import { useState } from "react";
import ToolsNav from "../components/ToolsNav";
import ShareButtons from "../components/ShareButtons";
import { usePageTitle } from "../hooks/usePageTitle";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
];

export default function PricingTableBuilderPage() {
  usePageTitle("Pricing Table Builder — Line Items, Tax & Discount Calculator");

  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [items, setItems] = useState([
    { description: "Design & wireframes", quantity: 1, unit_price: 2500 },
    { description: "Frontend development", quantity: 80, unit_price: 150 },
    { description: "Backend development", quantity: 60, unit_price: 150 },
  ]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountType, setDiscountType] = useState("percent");
  const [discountFlat, setDiscountFlat] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [taxLabel, setTaxLabel] = useState("Tax");

  const addItem = () => setItems((prev) => [...prev, { description: "", quantity: 1, unit_price: 0 }]);
  const updateItem = (idx, field, value) => setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const discountAmt = discountType === "percent" ? subtotal * (discountPercent / 100) : discountFlat;
  const afterDiscount = Math.max(0, subtotal - discountAmt);
  const taxAmt = afterDiscount * (taxPercent / 100);
  const total = afterDiscount + taxAmt;

  const sym = currency.symbol;
  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const copyAsText = () => {
    const lines = [
      "PRICING TABLE",
      "=".repeat(60),
      ...items.filter((i) => i.description).map((i) => `${i.description}  x${i.quantity}  @ ${sym}${fmt(i.unit_price)}  = ${sym}${fmt(i.quantity * i.unit_price)}`),
      "-".repeat(60),
      `Subtotal: ${sym}${fmt(subtotal)}`,
    ];
    if (discountAmt > 0) lines.push(`Discount: -${sym}${fmt(discountAmt)}`);
    if (taxAmt > 0) lines.push(`${taxLabel} (${taxPercent}%): +${sym}${fmt(taxAmt)}`);
    lines.push(`TOTAL: ${sym}${fmt(total)}`);
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container" style={{ maxWidth: 800 }}>
          <h1 className="tool-title">Pricing Table Builder</h1>
          <p className="tool-subtitle">
            Build a professional pricing table with line items, tax, and discount calculations. Copy or use in your proposal.
          </p>

          <div className="calc-card" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "end", marginBottom: "1rem" }}>
              <label className="calc-label" style={{ marginBottom: 0, flex: 1 }}>
                Currency
                <select className="calc-select" value={currency.code} onChange={(e) => setCurrency(CURRENCIES.find((c) => c.code === e.target.value))}>
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                </select>
              </label>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2A2A2D" }}>
                    <th style={{ textAlign: "left", padding: "0.5rem 0.5rem 0.5rem 0", color: "#9CA3AF", fontWeight: 600, fontSize: "0.8rem" }}>Description</th>
                    <th style={{ textAlign: "right", padding: "0.5rem", color: "#9CA3AF", fontWeight: 600, fontSize: "0.8rem", width: "80px" }}>Qty</th>
                    <th style={{ textAlign: "right", padding: "0.5rem", color: "#9CA3AF", fontWeight: 600, fontSize: "0.8rem", width: "120px" }}>Unit Price</th>
                    <th style={{ textAlign: "right", padding: "0.5rem", color: "#9CA3AF", fontWeight: 600, fontSize: "0.8rem", width: "120px" }}>Amount</th>
                    <th style={{ width: "40px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "0.4rem 0.5rem 0.4rem 0" }}>
                        <input className="calc-input" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Item description" style={{ marginTop: 0, fontSize: "0.9rem", padding: "0.4rem 0.5rem" }} />
                      </td>
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        <input className="calc-input" type="number" min="1" value={item.quantity} onChange={(e) => updateItem(i, "quantity", Number(e.target.value))} style={{ marginTop: 0, textAlign: "right", fontSize: "0.9rem", padding: "0.4rem 0.5rem" }} />
                      </td>
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        <input className="calc-input" type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateItem(i, "unit_price", Number(e.target.value))} style={{ marginTop: 0, textAlign: "right", fontSize: "0.9rem", padding: "0.4rem 0.5rem" }} />
                      </td>
                      <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", color: "#fff", fontWeight: 500 }}>
                        {sym}{fmt(item.quantity * item.unit_price)}
                      </td>
                      <td>
                        <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.1rem" }}>&times;</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={addItem} style={{ background: "none", border: "1px dashed rgba(240,180,41,0.4)", color: "#F0B429", padding: "0.4rem 1rem", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", marginTop: "0.75rem" }}>
              + Add Line Item
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            <div className="calc-card">
              <label className="calc-label" style={{ marginBottom: "0.5rem" }}>
                Discount
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                  <select className="calc-select" value={discountType} onChange={(e) => setDiscountType(e.target.value)} style={{ width: "auto", flex: "0 0 auto" }}>
                    <option value="percent">%</option>
                    <option value="flat">{sym}</option>
                  </select>
                  {discountType === "percent" ? (
                    <input className="calc-input" type="number" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} style={{ marginTop: 0 }} />
                  ) : (
                    <input className="calc-input" type="number" min="0" value={discountFlat} onChange={(e) => setDiscountFlat(Number(e.target.value))} style={{ marginTop: 0 }} />
                  )}
                </div>
              </label>
            </div>
            <div className="calc-card">
              <label className="calc-label" style={{ marginBottom: "0.5rem" }}>
                {taxLabel} Rate (%)
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                  <input className="calc-input" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} placeholder="Tax" style={{ marginTop: 0, width: "80px", flex: "0 0 auto" }} />
                  <input className="calc-input" type="number" min="0" max="100" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} style={{ marginTop: 0 }} />
                </div>
              </label>
            </div>
          </div>

          <div className="calc-card">
            <div className="calc-result" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
              <div className="calc-result-row"><span>Subtotal</span><strong>{sym}{fmt(subtotal)}</strong></div>
              {discountAmt > 0 && <div className="calc-result-row"><span>Discount</span><strong style={{ color: "#ef4444" }}>-{sym}{fmt(discountAmt)}</strong></div>}
              {taxAmt > 0 && <div className="calc-result-row"><span>{taxLabel} ({taxPercent}%)</span><strong>+{sym}{fmt(taxAmt)}</strong></div>}
              <div className="calc-result-row calc-total"><span>Total</span><strong>{sym}{fmt(total)}</strong></div>
            </div>
            <button onClick={copyAsText} className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
              Copy Pricing Table as Text
            </button>
          </div>

          <ShareButtons path="/tools/pricing-table" text="Free Pricing Table Builder — build line items with tax & discount calculations" />

          <div className="calc-card" style={{ textAlign: "center", marginTop: "1rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#9CA3AF", marginBottom: "0.75rem" }}>Want to embed pricing tables directly in your proposals?</p>
            <a href="/" className="btn btn-primary" style={{ display: "inline-block" }}>Sign up free</a>
          </div>

          <section className="tool-info">
            <h2>How to Price Your Proposals</h2>
            <p>
              Transparent pricing builds trust with clients. Break down costs by deliverable or phase
              so clients understand exactly what they're paying for. Include quantity and unit prices
              for line items, and always show tax and discounts clearly.
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
            name: "Pricing Table Builder",
            description: "Build professional pricing tables with line items, tax, and discount calculations for proposals.",
            url: "https://proposals.doaide.com/tools/pricing-table",
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
