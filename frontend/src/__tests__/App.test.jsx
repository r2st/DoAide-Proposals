import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false }),
  AuthProvider: ({ children }) => children,
}));

vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'system', setTheme: vi.fn() }),
  ThemeProvider: ({ children }) => children,
}));

import App from '../App';

describe('App', () => {
  it('renders landing page at root', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/DoAide Proposals/i).length).toBeGreaterThan(0);
  });

  it('renders login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders register page', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument();
  });

  it('renders pricing page', () => {
    render(
      <MemoryRouter initialEntries={['/pricing']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Simple Pricing' })).toBeInTheDocument();
  });

  it('redirects unauthenticated user from dashboard to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });
});
