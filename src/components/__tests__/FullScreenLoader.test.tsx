import { FullScreenLoader } from '@Components/FullScreenLoader';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('FullScreenLoader', () => {
  it('renders Backdrop when open is true', () => {
    render(<FullScreenLoader open />);

    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();
  });

  it('does not render Backdrop when open is false', () => {
    render(<FullScreenLoader open={false} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
