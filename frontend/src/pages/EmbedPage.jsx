import { useState } from "react";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { copyToClipboard, embedSnippet } from "../lib/share";
import { track } from "../lib/track";

const TOOLS = [
  { key: "generator", label: "Proposal Generator", desc: "Let visitors generate proposal outlines on your website" },
  { key: "calculator", label: "Cost Estimator", desc: "Let visitors estimate project costs" },
  { key: "templates", label: "Template Gallery", desc: "Showcase proposal templates on your website" },
];

export default function EmbedPage() {
  usePageTitle("Embed Proposal Tools on Your Website — Free Widget");
  const [tool, setTool] = useState("calculator");
  const [copied, setCopied] = useState(false);

  const snippet = embedSnippet(tool);

  const handleCopy = async () => {
    const ok = await copyToClipboard(snippet);
    if (ok) {
      track("embed_copy", { tool });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Embed Proposal Tools on Your Website</h1>
          <p className="tool-subtitle">
            Add a free proposal generator, cost estimator, or template gallery to your website with one
            line of code. No sign-up required.
          </p>

          <div className="calc-card">
            <div className="embed-tools" role="group" aria-label="Choose tool to embed">
              {TOOLS.map((t) => (
                <button
                  key={t.key}
                  className={`embed-tool-btn${tool === t.key ? " active" : ""}`}
                  onClick={() => setTool(t.key)}
                >
                  <strong>{t.label}</strong>
                  <span>{t.desc}</span>
                </button>
              ))}
            </div>

            <label className="calc-label">
              Copy this code to your website
              <pre className="embed-code">{snippet}</pre>
            </label>

            <button onClick={handleCopy} className="btn btn-primary">
              {copied ? "Copied!" : "Copy embed code"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
