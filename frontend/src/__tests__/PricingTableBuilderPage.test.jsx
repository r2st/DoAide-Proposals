import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import PricingTableBuilderPage from '../pages/PricingTableBuilderPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <PricingTableBuilderPage />
    </MemoryRouter>
  );
}

describe('PricingTableBuilderPage', () => {
  it('renders title', () => {
    renderPage();
    expect(screen.getByText('Pricing Table Builder')).toBeInTheDocument();
  });

  it('shows default line items', () => {
    renderPage();
    expect(screen.getByDisplayValue('Design & wireframes')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Frontend development')).toBeInTheDocument();
  });

  it('calculates subtotal', () => {
    renderPage();
    expect(screen.getByText(/Subtotal/)).toBeInTheDocument();
  });

  it('adds a new line item', async () => {
    const user = userEvent.setup();
    renderPage();
    const addBtn = screen.getByText('+ Add Line Item');
    await user.click(addBtn);
    const inputs = screen.getAllByPlaceholderText('Item description');
    expect(inputs.length).toBe(4);
  });

  it('removes a line item', async () => {
    const user = userEvent.setup();
    renderPage();
    const removeButtons = screen.getAllByText('×');
    await user.click(removeButtons[0]);
    const inputs = screen.getAllByPlaceholderText('Item description');
    expect(inputs.length).toBe(2);
  });

  it('has currency selector', () => {
    renderPage();
    expect(screen.getByText('Currency')).toBeInTheDocument();
  });

  it('has copy button', () => {
    renderPage();
    expect(screen.getByText('Copy Pricing Table as Text')).toBeInTheDocument();
  });
});
