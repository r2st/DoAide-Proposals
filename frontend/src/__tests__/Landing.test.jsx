import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Landing from '../pages/Landing';

function renderLanding() {
  return render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );
}

describe('Landing', () => {
  it('renders hero heading', () => {
    renderLanding();
    expect(screen.getByText(/Powered by AI/)).toBeInTheDocument();
  });

  it('renders all 6 feature cards', () => {
    renderLanding();
    expect(screen.getByText('AI-Powered Generation')).toBeInTheDocument();
    expect(screen.getByText('Template Builder')).toBeInTheDocument();
    expect(screen.getByText('Client Management')).toBeInTheDocument();
    expect(screen.getByText('Smart Pricing Engine')).toBeInTheDocument();
    expect(screen.getByText('PDF Export')).toBeInTheDocument();
    expect(screen.getByText('E-Signatures')).toBeInTheDocument();
  });

  it('renders how-it-works section', () => {
    renderLanding();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Choose a template')).toBeInTheDocument();
    expect(screen.getByText('AI writes your proposal')).toBeInTheDocument();
    expect(screen.getByText('Send & get signed')).toBeInTheDocument();
  });

  it('renders pricing section with 3 tiers', () => {
    renderLanding();
    expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$19')).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
  });

  it('renders testimonials', () => {
    renderLanding();
    expect(screen.getByText(/Sarah T\./)).toBeInTheDocument();
    expect(screen.getByText(/James K\./)).toBeInTheDocument();
    expect(screen.getByText(/Priya M\./)).toBeInTheDocument();
  });

  it('renders FAQ section with accordion', async () => {
    renderLanding();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    const firstQ = screen.getByText('What types of proposals can I create?');
    expect(firstQ).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(firstQ);
    expect(screen.getByText(/Business proposals, project quotes/)).toBeInTheDocument();
  });

  it('has Get Started links', () => {
    renderLanding();
    const links = screen.getAllByText(/Get Started/);
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders footer with DoAide products', () => {
    renderLanding();
    expect(screen.getByText('DoAide Products')).toBeInTheDocument();
    expect(screen.getByText('doaide.com')).toBeInTheDocument();
  });

  it('renders free tools section', () => {
    renderLanding();
    expect(screen.getByText('Free Proposal Tools')).toBeInTheDocument();
    expect(screen.getAllByText('Proposal Generator').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cost Estimator').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Template Gallery').length).toBeGreaterThan(0);
  });
});
