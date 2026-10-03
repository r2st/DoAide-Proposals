import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));
vi.mock("../lib/share", () => ({
  fullUrl: vi.fn(() => "https://proposals.doaide.com/calculator"),
  whatsappUrl: vi.fn(() => "https://wa.me/"),
  twitterUrl: vi.fn(() => "https://twitter.com/intent/tweet"),
  copyToClipboard: vi.fn(),
}));

import CostCalculatorPage from "../pages/CostCalculatorPage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/calculator"]}>
      <CostCalculatorPage />
    </MemoryRouter>
  );
}

describe("CostCalculatorPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Project Cost Estimator" })).toBeInTheDocument();
  });

  it("shows cost breakdown with default values", () => {
    renderPage();
    expect(screen.getByText("Estimated Total")).toBeInTheDocument();
    expect(screen.getAllByText(/Overhead/).length).toBeGreaterThan(0);
  });

  it("updates cost when inputs change", () => {
    renderPage();
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "5" } });
    expect(screen.getByText("Estimated Total")).toBeInTheDocument();
  });
});
