import { DetailCenterAligned, ValueMap } from '@Components/DetailCenterAligned';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('DetailCenterAligned', () => {
  it('renders key-value pairs correctly', () => {
    const values: ValueMap = {
      'Label 1': 'Value 1',
      'Label 2': 'Value 2',
    };

    render(<DetailCenterAligned values={values} />);

    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
    expect(screen.getByText('Value 2')).toBeInTheDocument();
  });

  it('renders null or undefined values as hyphen', () => {
    const values: ValueMap = {
      'Label 1': null,
      'Label 2': undefined,
    };

    render(<DetailCenterAligned values={values} />);

    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(2);
  });

  it('renders React elements correctly', () => {
    const values: ValueMap = {
      'Label 1': <span data-testid="custom-element">Custom Element</span>,
    };

    render(<DetailCenterAligned values={values} />);

    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
  });
});
