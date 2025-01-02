import { Main } from '@Components/Main';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Main', () => {
  it('renders with correct styles', () => {
    const { container } = render(<Main />);

    expect(container.firstChild).toHaveStyle('min-height: 100vh');
  });
});
