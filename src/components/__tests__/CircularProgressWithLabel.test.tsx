import { CircularProgressWithLabel } from '@Components/CircularProgressWithLabel';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('CircularProgressWithLabel', () => {
  it('renders the CircularProgress component', () => {
    render(<CircularProgressWithLabel value={50} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('displays the correct percentage label', () => {
    render(<CircularProgressWithLabel value={75} />);
    const label = screen.getByText('75%');
    expect(label).toBeInTheDocument();
  });

  it('updates the label based on value prop', () => {
    render(<CircularProgressWithLabel value={25} />);
    const label = screen.getByText('25%');
    expect(label).toBeInTheDocument();
  });

  it('handles value rounding correctly', () => {
    render(<CircularProgressWithLabel value={33.7} />);
    const label = screen.getByText('34%');
    expect(label).toBeInTheDocument();
  });

  it('uses the determinate variant for CircularProgress', () => {
    render(<CircularProgressWithLabel value={60} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '60');
  });
});
