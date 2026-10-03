import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PricingCalculatorPage from "./PricingCalculatorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("PricingCalculatorPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><PricingCalculatorPage /></MemoryRouter>);
    expect(screen.getByText("Pricing Calculator")).toBeInTheDocument();
  });

  it("shows input fields", () => {
    render(<MemoryRouter><PricingCalculatorPage /></MemoryRouter>);
    expect(screen.getByText("Base Cost ($)")).toBeInTheDocument();
    expect(screen.getByText("Profit Margin (%)")).toBeInTheDocument();
    expect(screen.getByText("Discount (%)")).toBeInTheDocument();
    expect(screen.getByText("Tax Rate (%)")).toBeInTheDocument();
  });

  it("displays calculated results", () => {
    render(<MemoryRouter><PricingCalculatorPage /></MemoryRouter>);
    expect(screen.getByText("List Price")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Profit")).toBeInTheDocument();
  });
});
