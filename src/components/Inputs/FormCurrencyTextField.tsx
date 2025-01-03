import { TextFieldProps, InputAdornment } from '@mui/material';
import { Controller, ControllerRenderProps, FieldError, FieldValues, Path, useFormContext } from 'react-hook-form';
import { ChangeEvent, FocusEvent, KeyboardEvent, useCallback } from 'react';
import { CurrencyTextField } from '@/components/Inputs/CurrencyTextField';

type BaseCurrencyFieldProps = {
  tooltip?: string;
  tooltipEnterDelay?: number;
} & TextFieldProps;

interface FormCurrencyFieldProps<TFieldValues extends FieldValues> extends Omit<BaseCurrencyFieldProps, 'name'> {
  name: Path<TFieldValues>;
  label: string;
}

export const preventInvalidChars = (e: KeyboardEvent<HTMLInputElement>) => {
  const invalidChars = ['e', 'E', '+', '-', '*', '/', ' '];
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * A controlled currency input field component for use with React Hook Form.
 * This component renders a text field with currency formatting and validation.
 *
 * @template TFieldValues - The type of the form values.
 */
export const FormCurrencyField = <TFieldValues extends FieldValues>({
  name,
  label,
  ...textFieldProps
}: FormCurrencyFieldProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  /**
   * Formats a given string value as a currency.
   */
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    if (isNaN(numericValue)) return '';
    return numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleOnChange = useCallback(
    (onChange: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.-]+/g, '');

      onChange(value);
    },
    [],
  );

  const handleOnBlur = useCallback(
    (onChange: (value: string) => void) => (e: FocusEvent<HTMLInputElement>) => {
      const formattedValue = formatCurrency(e.target.value);

      onChange(formattedValue);
    },
    [],
  );

  const renderTextField = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>; // Correct typing for `field`
      fieldState: { error?: FieldError }; // Type for `fieldState`
    }) => (
      <CurrencyTextField
        {...field}
        {...textFieldProps}
        label={label}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error ? fieldState.error.message : null}
        fullWidth
        onChange={handleOnChange(field.onChange)}
        onBlur={handleOnBlur(field.onChange)}
        onKeyDown={preventInvalidChars}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
    ),
    [handleOnBlur, handleOnChange, label, textFieldProps],
  );

  return <Controller name={name} control={control} render={renderTextField} />;
};
