import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));
vi.mock("../lib/share", () => ({
  embedSnippet: vi.fn((path) => `<iframe src="https://proposals.doaide.com/${path}"></iframe>`),
  copyToClipboard: vi.fn(),
}));

import EmbedPage from "../pages/EmbedPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <EmbedPage />
    </MemoryRouter>
  );
}

describe("EmbedPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByText(/Embed Proposal Tools/)).toBeInTheDocument();
  });

  it("shows embed code", () => {
    renderPage();
    expect(screen.getByText(/iframe/)).toBeInTheDocument();
  });

  it("has copy button", () => {
    renderPage();
    expect(screen.getByText("Copy embed code")).toBeInTheDocument();
  });
});
