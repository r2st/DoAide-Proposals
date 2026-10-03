import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));

import BlogLayout, { BlogIndex, ARTICLES } from "../pages/BlogLayout";

describe("BlogIndex", () => {
  it("renders all article cards", () => {
    render(
      <MemoryRouter>
        <BlogIndex />
      </MemoryRouter>
    );
    ARTICLES.forEach((a) => {
      expect(screen.getByText(a.title)).toBeInTheDocument();
    });
  });
});

describe("BlogLayout", () => {
  it("renders blog header", () => {
    render(
      <MemoryRouter>
        <BlogLayout />
      </MemoryRouter>
    );
    expect(screen.getByText("DoAide Proposals Blog")).toBeInTheDocument();
  });
});

describe("Blog articles", () => {
  it("ProposalWritingGuide renders", async () => {
    const { default: ProposalWritingGuide } = await import("../pages/blog/ProposalWritingGuide");
    render(
      <MemoryRouter>
        <ProposalWritingGuide />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("PricingStrategies renders", async () => {
    const { default: PricingStrategies } = await import("../pages/blog/PricingStrategies");
    render(
      <MemoryRouter>
        <PricingStrategies />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("ClientManagement renders", async () => {
    const { default: ClientManagement } = await import("../pages/blog/ClientManagement");
    render(
      <MemoryRouter>
        <ClientManagement />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
