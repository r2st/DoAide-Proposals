import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Landing from '../pages/Landing';

describe('Landing', () => {
  it('shows hero text', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    expect(screen.getByText(/Powered by AI/i)).toBeInTheDocument();
  });

  it('shows feature cards', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    expect(screen.getByText('AI-Powered Generation')).toBeInTheDocument();
    expect(screen.getByText('E-Signatures')).toBeInTheDocument();
  });

  it('has get started link', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
    const links = screen.getAllByText('Get Started');
    expect(links.length).toBeGreaterThan(0);
  });
});
