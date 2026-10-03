import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import WinRateEstimatorPage from "./WinRateEstimatorPage";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

describe("WinRateEstimatorPage", () => {
  it("renders the page title", () => {
    render(<MemoryRouter><WinRateEstimatorPage /></MemoryRouter>);
    expect(screen.getByText("Win Rate Estimator")).toBeInTheDocument();
  });

  it("shows all scoring factors", () => {
    render(<MemoryRouter><WinRateEstimatorPage /></MemoryRouter>);
    expect(screen.getByText(/Existing Relationship/)).toBeInTheDocument();
    expect(screen.getByText(/Competition Level/)).toBeInTheDocument();
    expect(screen.getByText(/Solution Fit/)).toBeInTheDocument();
  });

  it("updates win rate when factors change", () => {
    render(<MemoryRouter><WinRateEstimatorPage /></MemoryRouter>);
    expect(screen.getByText("0%")).toBeInTheDocument();
    const selects = screen.getAllByRole("combobox");
    selects.forEach((s) => fireEvent.change(s, { target: { value: "3" } }));
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
