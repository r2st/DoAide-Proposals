import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import GeneratorPage from "../pages/GeneratorPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <GeneratorPage />
    </MemoryRouter>
  );
}

describe("GeneratorPage", () => {
  it("renders the page title and form", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Proposal Generator" })).toBeInTheDocument();
    expect(screen.getByText("Generate Proposal Outline")).toBeInTheDocument();
  });

  it("generates an outline on button click", () => {
    renderPage();
    fireEvent.click(screen.getByText("Generate Proposal Outline"));
    expect(screen.getAllByText(/Executive Summary/).length).toBeGreaterThan(0);
  });

  it("shows share buttons after generating", () => {
    renderPage();
    fireEvent.click(screen.getByText("Generate Proposal Outline"));
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });
});
