import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { object, string, InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { describe, it, vi, expect } from 'vitest';
import { Form } from '@Components/forms/Form';

describe('Form', () => {
  const schema = object().shape({
    name: string().required('Name is required'),
  });

  type FormValues = InferType<typeof schema>;

  const TestForm = ({
    onSubmit,
    disabled = false,
  }: {
    onSubmit: (data: FormValues) => Promise<void>;
    disabled?: boolean;
  }) => {
    const methods = useForm<FormValues>({
      resolver: yupResolver(schema),
      defaultValues: { name: '' },
    });

    return (
      <Form
        methods={methods}
        onFormSubmit={onSubmit}
        disabled={disabled}
        renderFormContent={() => (
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" {...methods.register('name')} />
            {methods.formState.errors.name && <span>{methods.formState.errors.name.message}</span>}
          </div>
        )}
        actions={
          <button type="submit" data-testid="submit-button">
            Submit
          </button>
        }
      />
    );
  };

  it('should render the form content and actions', () => {
    const mockOnSubmit = vi.fn();
    render(<TestForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should show validation error for invalid data', async () => {
    const mockOnSubmit = vi.fn();
    render(<TestForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should disable the form when disabled is true', () => {
    const mockOnSubmit = vi.fn();
    render(<TestForm onSubmit={mockOnSubmit} disabled />);

    const input = screen.getByLabelText('Name');
    const button = screen.getByTestId('submit-button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should enable the form when disabled is false', () => {
    const mockOnSubmit = vi.fn();
    render(<TestForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Name');
    const button = screen.getByTestId('submit-button');

    expect(input).not.toBeDisabled();
    expect(button).not.toBeDisabled();
  });
});
