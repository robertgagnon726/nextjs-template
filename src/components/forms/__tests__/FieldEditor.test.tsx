import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { FieldEditor } from '@Components/forms/FieldEditor';

describe('FieldEditor', () => {
  const mockUpdateAccountSettings = vi.fn();
  const mockMutate = vi.fn();
  const mockSetEditField = vi.fn();

  const defaultProps = {
    label: 'Account Name',
    fieldName: 'name' as const,
    fieldValue: 'My Account',
    editField: null,
    setEditField: mockSetEditField,
    updateAccountSettings: mockUpdateAccountSettings,
    mutate: mockMutate,
    description: 'This is the account name.',
  };

  it('should display the field value and edit button when not editing', () => {
    render(<FieldEditor {...defaultProps} />);

    expect(screen.getByText('Account Name')).toBeInTheDocument();
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByLabelText('edit name')).toBeInTheDocument();
  });

  it('should switch to edit mode when the edit button is clicked', () => {
    render(<FieldEditor {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('edit name'));

    expect(mockSetEditField).toHaveBeenCalledWith('name');
  });

  it('should display the form with default value in edit mode', () => {
    render(<FieldEditor {...defaultProps} editField="name" />);

    expect(screen.getByRole('textbox')).toHaveValue('My Account');
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call updateAccountSettings and mutate on form submission', async () => {
    render(<FieldEditor {...defaultProps} editField="name" />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Account' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdateAccountSettings).toHaveBeenCalledWith({ name: 'Updated Account' });
      expect(mockMutate).toHaveBeenCalled();
      expect(mockSetEditField).toHaveBeenCalledWith(null);
    });
  });

  it('should reset the field and exit edit mode on cancel', () => {
    render(<FieldEditor {...defaultProps} editField="name" />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated Account' } });
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByRole('textbox')).toHaveValue('My Account');
    expect(mockSetEditField).toHaveBeenCalledWith(null);
  });

  it('should display the description when provided', () => {
    render(<FieldEditor {...defaultProps} />);

    expect(screen.getByText('This is the account name.')).toBeInTheDocument();
  });
});
