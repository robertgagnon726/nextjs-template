import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCallback } from 'react';

export interface FormDatePickerProps<TFieldValues extends FieldValues> extends Omit<DatePickerProps<Date>, 'name'> {
  name: Path<TFieldValues>;
  label: string;
  error?: string;
  minDate?: Date;
}

interface RenderDatePickerProps {
  field: {
    onChange: (date: Date | null) => void;
    value: Date | null;
  };
}

export const FormatePicker = <TFieldValues extends FieldValues>({
  name,
  label,
  error,
  minDate,
  ...rest
}: FormDatePickerProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  const renderDatePicker = useCallback(
    ({ field }: RenderDatePickerProps) => (
      <DatePicker {...rest} {...field} minDate={minDate} label={label} sx={{ width: '100%' }} />
    ),
    [rest, minDate, label],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller name={name} control={control} render={renderDatePicker} />
      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </LocalizationProvider>
  );
};
