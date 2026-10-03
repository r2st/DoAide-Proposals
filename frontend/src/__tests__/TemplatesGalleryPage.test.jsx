import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import TemplatesGalleryPage from "../pages/TemplatesGalleryPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <TemplatesGalleryPage />
    </MemoryRouter>
  );
}

describe("TemplatesGalleryPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByText("Proposal Templates")).toBeInTheDocument();
  });

  it("shows all six template cards", () => {
    renderPage();
    expect(screen.getByText("Consulting Proposal")).toBeInTheDocument();
    expect(screen.getByText("Software Development")).toBeInTheDocument();
    expect(screen.getByText("Marketing Campaign")).toBeInTheDocument();
    expect(screen.getByText("Design Project")).toBeInTheDocument();
    expect(screen.getByText("Construction Bid")).toBeInTheDocument();
    expect(screen.getByText("Freelance Proposal")).toBeInTheDocument();
  });

  it("shows CTA link to register", () => {
    renderPage();
    const ctas = screen.getAllByText(/Use this template/i);
    expect(ctas.length).toBe(6);
  });
});
