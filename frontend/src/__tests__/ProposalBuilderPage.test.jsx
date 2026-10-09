import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ProposalBuilderPage from '../pages/ProposalBuilderPage';

const MOCK_TEMPLATES = [
  {
    slug: "consulting",
    name: "Consulting Proposal",
    description: "Professional consulting engagement.",
    sections: [
      { title: "Executive Summary", hint: "Summarize the engagement." },
      { title: "Approach", hint: "Outline your consulting framework." },
    ],
    default_terms: "Net 30",
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <ProposalBuilderPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
    if (url.includes('/api/public/seed-templates')) {
      return Promise.resolve({
        json: () => Promise.resolve(MOCK_TEMPLATES),
        ok: true,
      });
    }
    return Promise.resolve({ blob: () => Promise.resolve(new Blob(['pdf'])), ok: true });
  });
});

describe('ProposalBuilderPage', () => {
  it('renders title and step indicator', async () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Proposal Builder' })).toBeInTheDocument();
    expect(screen.getByText('Template')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('loads and displays templates', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Consulting Proposal')).toBeInTheDocument();
    });
  });

  it('shows start from scratch option', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Start from Scratch')).toBeInTheDocument();
    });
  });

  it('navigates to details step on template select', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => screen.getByText('Consulting Proposal'));
    await user.click(screen.getByText('Consulting Proposal'));
    expect(screen.getByText('Proposal Details')).toBeInTheDocument();
  });

  it('navigates through all steps', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => screen.getByText('Start from Scratch'));
    await user.click(screen.getByText('Start from Scratch'));
    expect(screen.getByText('Proposal Details')).toBeInTheDocument();

    await user.click(screen.getByText('Next: Sections'));
    expect(screen.getByText('Proposal Sections')).toBeInTheDocument();

    await user.click(screen.getByText('Next: Pricing'));
    expect(screen.getByText('Pricing Table')).toBeInTheDocument();

    await user.click(screen.getByText('Next: Review'));
    expect(screen.getByText('Review & Download')).toBeInTheDocument();
  });
});
