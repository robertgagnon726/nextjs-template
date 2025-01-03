import { TextField, TextFieldProps, Tooltip } from '@mui/material';
import React, { useCallback } from 'react';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  useFormContext,
  UseFormStateReturn,
} from 'react-hook-form';

interface FormTextFieldProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name' | 'error'> {
  name: Path<TFieldValues>;
  label: string;
  startAdornment?: React.ReactNode; // Add this prop for start adornments
  tooltip?: string;
  // Primarily added to make testing easier
  tooltipEnterDelay?: number;
}

export function FormTextField<TFieldValues extends FieldValues>({
  name,
  label,
  startAdornment, // Destructure the new prop
  tooltip,
  required,
  tooltipEnterDelay = 2000,
  ...textFieldProps
}: FormTextFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  const preventInvalidChars = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const invalidNumberChars = ['e', 'E', '+', '-', ',', '*', '/', ' '];
      if (textFieldProps.type === 'number' && invalidNumberChars.includes(e.key)) {
        e.preventDefault();
      }
    },
    [textFieldProps.type],
  );

  const handleTextFieldChange = useCallback(
    (field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (textFieldProps.type === 'number') {
        // Remove leading zeros
        value = value.replace(/^0+(?!$)/, '');
      }
      field.onChange(value);
    },
    [textFieldProps.type],
  );

  const handleTextFieldOnBlur = useCallback(
    (field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>) => (e: React.FocusEvent<HTMLInputElement>) => {
      if (textFieldProps.type === 'number' && e.target.value === '') {
        field.onChange('0'); // Set value to '0' if empty on blur
      }

      field.onBlur();
    },
    [textFieldProps.type],
  );

  const handleWheel = useCallback((e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  }, []);

  const renderTextField = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<TFieldValues>;
    }) => {
      const inputValue = field.value ?? (textFieldProps.type === 'number' ? 0 : '');
      return (
        <Tooltip
          title={tooltip}
          arrow
          enterDelay={tooltipEnterDelay}
          leaveDelay={200}
          placement="top"
          enterNextDelay={2000}
        >
          <TextField
            {...field}
            {...textFieldProps}
            value={inputValue}
            label={`${label}${required ? '*' : ''}`}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error ? fieldState.error.message : null}
            fullWidth
            onWheel={handleWheel}
            InputProps={{
              startAdornment: startAdornment ? startAdornment : null,
              ...textFieldProps.InputProps,
            }}
            onChange={handleTextFieldChange(field)}
            onBlur={handleTextFieldOnBlur(field)}
            onKeyDown={preventInvalidChars}
          />
        </Tooltip>
      );
    },
    [
      handleTextFieldChange,
      handleTextFieldOnBlur,
      handleWheel,
      label,
      preventInvalidChars,
      required,
      startAdornment,
      textFieldProps,
      tooltip,
      tooltipEnterDelay,
    ],
  );

  return <Controller name={name} control={control} render={renderTextField} />;
}
