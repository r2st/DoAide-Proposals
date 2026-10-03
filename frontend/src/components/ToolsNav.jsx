import { Link, useLocation } from "react-router-dom";

const TOOLS = [
  { path: "/tools", label: "All Tools" },
  { path: "/generator", label: "Proposal Generator" },
  { path: "/calculator", label: "Cost Estimator" },
  { path: "/templates-gallery", label: "Templates" },
];

export default function ToolsNav() {
  const { pathname } = useLocation();

  return (
    <nav className="tools-nav" aria-label="Proposal tools">
      <a href="https://proposals.doaide.com" className="tools-nav-brand">
        DoAide <em>Proposals</em>
      </a>
      <div className="tools-nav-links">
        {TOOLS.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            className={`tools-nav-link${pathname === t.path ? " active" : ""}`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Link to="/" className="tools-nav-cta">Sign up free</Link>
    </nav>
  );
}
