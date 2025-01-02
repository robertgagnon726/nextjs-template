import { TextFieldProps, Tooltip } from '@mui/material';
import { useCallback } from 'react';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  useFormContext,
  UseFormStateReturn,
} from 'react-hook-form';
import { MuiTelInput } from 'mui-tel-input';

interface FormPhoneNumberInputProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name' | 'error'> {
  name: Path<TFieldValues>;
  label: string;
  tooltip?: string;
  // Primarily added to make testing easier
  tooltipEnterDelay?: number;
}

export function FormPhoneNumberInput<TFieldValues extends FieldValues>({
  name,
  label,
  tooltip,
  required,
  tooltipEnterDelay = 2000,
}: FormPhoneNumberInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  const renderTextField = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<TFieldValues>;
    }) => {
      return (
        <Tooltip
          title={tooltip}
          arrow
          enterDelay={tooltipEnterDelay}
          leaveDelay={200}
          placement="top"
          enterNextDelay={2000}
        >
          <MuiTelInput
            {...field}
            value={field.value || ''}
            fullWidth
            onChange={(value) => field.onChange(value)}
            onBlur={field.onBlur}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error ? fieldState.error.message : null}
            defaultCountry="US"
            label={`${label}${required ? '*' : ''}`}
            onlyCountries={['US', 'CA']}
            autoComplete="tel"
          />
        </Tooltip>
      );
    },
    [label, required, tooltip, tooltipEnterDelay],
  );

  return <Controller name={name} control={control} render={renderTextField} />;
}
