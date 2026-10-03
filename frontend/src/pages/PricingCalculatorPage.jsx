import { useState } from "react";
import ToolsNav from "../components/ToolsNav";
import ShareButtons from "../components/ShareButtons";
import { usePageTitle } from "../hooks/usePageTitle";

export default function PricingCalculatorPage() {
  usePageTitle("Pricing Calculator");
  const [baseCost, setBaseCost] = useState(10000);
  const [margin, setMargin] = useState(30);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);

  const price = baseCost * (1 + margin / 100);
  const discountAmt = price * (discount / 100);
  const subtotal = price - discountAmt;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  const profit = subtotal - baseCost;
  const effectiveMargin = baseCost > 0 ? ((profit / baseCost) * 100).toFixed(1) : "0.0";

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Pricing Calculator</h1>
          <p className="tool-subtitle">
            Calculate project pricing with margins, discounts, and taxes — no sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Base Cost ($)
              <input className="calc-input" type="number" min="0" value={baseCost} onChange={(e) => setBaseCost(Number(e.target.value))} />
            </label>
            <label className="calc-label">
              Profit Margin (%)
              <input className="calc-input" type="number" min="0" max="500" value={margin} onChange={(e) => setMargin(Number(e.target.value))} />
            </label>
            <label className="calc-label">
              Discount (%)
              <input className="calc-input" type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </label>
            <label className="calc-label">
              Tax Rate (%)
              <input className="calc-input" type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            </label>
          </div>

          <div className="calc-card" style={{ marginTop: "1rem" }}>
            <div className="calc-result">
              <div className="calc-result-row">
                <span>List Price</span>
                <strong>${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              {discount > 0 && (
                <div className="calc-result-row">
                  <span>Discount ({discount}%)</span>
                  <strong style={{ color: "#ef4444" }}>−${discountAmt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              )}
              <div className="calc-result-row">
                <span>Subtotal</span>
                <strong>${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              {taxRate > 0 && (
                <div className="calc-result-row">
                  <span>Tax ({taxRate}%)</span>
                  <strong>+${tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              )}
              <div className="calc-result-row calc-total">
                <span>Total</span>
                <strong>${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div className="calc-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9CA3AF" }}>Profit</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: profit >= 0 ? "#22c55e" : "#ef4444" }}>
                ${profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="calc-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9CA3AF" }}>Effective Margin</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F0B429" }}>{effectiveMargin}%</div>
            </div>
          </div>

          <ShareButtons path="/tools/pricing-calculator" text="Pricing Calculator — Free tool by DoAide Proposals" />

          <div className="calc-card" style={{ textAlign: "center", marginTop: "1rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#9CA3AF", marginBottom: "0.75rem" }}>Want to include pricing breakdowns in your proposals?</p>
            <a href="/" className="btn btn-primary" style={{ display: "inline-block" }}>Sign up free</a>
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Pricing Calculator",
            description: "Calculate project pricing with margins, discounts, and taxes for proposals.",
            url: "https://proposals.doaide.com/tools/pricing-calculator",
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
