import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ToolsIndexPage from "./ToolsIndexPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("ToolsIndexPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><ToolsIndexPage /></MemoryRouter>);
    expect(screen.getByText("Free Proposal Tools")).toBeInTheDocument();
  });

  it("lists all tool cards", () => {
    render(<MemoryRouter><ToolsIndexPage /></MemoryRouter>);
    expect(screen.getByText("Win Rate Estimator")).toBeInTheDocument();
    expect(screen.getByText("Pricing Calculator")).toBeInTheDocument();
    expect(screen.getByText("Proposal Templates")).toBeInTheDocument();
  });

  it("links to individual tool pages", () => {
    render(<MemoryRouter><ToolsIndexPage /></MemoryRouter>);
    const link = screen.getByText("Win Rate Estimator").closest("a");
    expect(link).toHaveAttribute("href", "/tools/win-rate");
  });
});
