import { renderHook, act } from '@testing-library/react';
import * as yup from 'yup';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAlert } from '@Components/Alert';
import { useFormLogic } from '@Components/forms/useFormLogic';

// Mock useAlert
vi.mock('../../Alert', () => ({
  useAlert: vi.fn(),
}));

const mockSetAlert = vi.fn();

beforeEach(() => {
  vi.mocked(useAlert).mockReturnValue({
    setAlert: mockSetAlert,
  });
  vi.clearAllMocks();
});

describe('useFormLogic', () => {
  const defaultValues = { name: '', date: new Date() };
  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    date: yup.date().required(),
  });
  const mockOnSubmit = vi.fn();

  it('initializes with default values and validation schema', () => {
    const { result } = renderHook(() =>
      useFormLogic({
        defaultValues,
        validationSchema,
        onSubmit: mockOnSubmit,
      }),
    );

    expect(result.current.methods.getValues()).toEqual(defaultValues);
  });

  it('triggers onFieldChange when watchField changes', () => {
    const onFieldChange = vi.fn();
    const { result } = renderHook(() =>
      useFormLogic({
        defaultValues,
        validationSchema,
        onSubmit: mockOnSubmit,
        watchField: 'name',
        onFieldChange,
      }),
    );

    act(() => {
      result.current.methods.setValue('name', 'New Name');
    });

    expect(onFieldChange).toHaveBeenCalledWith('New Name');
  });

  it('resets the form when defaultValues change', () => {
    const { result, rerender } = renderHook(
      ({ defaultValues }) =>
        useFormLogic({
          defaultValues,
          validationSchema,
          onSubmit: mockOnSubmit,
        }),
      {
        initialProps: { defaultValues },
      },
    );

    const newValues = { name: 'Updated Name', date: new Date() };

    act(() => {
      rerender({ defaultValues: newValues });
    });

    expect(result.current.methods.getValues()).toEqual(newValues);
  });

  it('handles successful form submission', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useFormLogic({
        defaultValues,
        validationSchema,
        onSubmit: mockOnSubmit,
      }),
    );

    act(() => {
      result.current.methods.setValue('name', 'Valid Name');
    });

    await act(async () => {
      await result.current.methods.handleSubmit(result.current.onFormSubmit)();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Valid Name', date: defaultValues.date });
    expect(result.current.methods.getValues()).toEqual(defaultValues); // Form reset
    expect(mockSetAlert).not.toHaveBeenCalled();
  });

  it('handles failed form submission and shows an alert', async () => {
    const errorMessage = 'Submission error';
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() =>
      useFormLogic({
        defaultValues,
        validationSchema,
        onSubmit: mockOnSubmit,
      }),
    );

    act(() => {
      result.current.methods.setValue('name', 'Valid Name');
    });

    await act(async () => {
      await result.current.methods.handleSubmit(result.current.onFormSubmit)();
    });

    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockSetAlert).toHaveBeenCalledWith(errorMessage, 'error');
    expect(result.current.methods.getValues().name).toEqual('Valid Name'); // Form not reset
  });
});
