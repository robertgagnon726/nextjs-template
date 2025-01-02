import { Checkbox, FormControl, FormControlLabel, FormHelperText, Tooltip } from '@mui/material';
import { Controller, useFormContext, FieldValues, Path, ControllerRenderProps } from 'react-hook-form';
import { get } from 'lodash';
import { useCallback } from 'react';

// Define the props for the component
interface FormCheckboxProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  tooltip?: string;
  id?: string;
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  name,
  label,
  required,
  tooltip,
  id,
}: FormCheckboxProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const errorMessage = get(errors, name)?.message;

  // Define the renderer for the Controller
  const controllerRenderer = useCallback(
    ({ field }: { field: ControllerRenderProps<TFieldValues, Path<TFieldValues>> }) => (
      <FormControlLabel
        control={
          <Checkbox
            data-testid={`controlled-checkbox-${name}`}
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            id={id}
          />
        }
        label={`${label}${required ? '*' : ''}`}
      />
    ),
    [name, label, required, id],
  );

  return (
    <FormControl error={Boolean(errorMessage)} sx={{ width: '100%' }}>
      <Tooltip title={tooltip || ''} arrow enterDelay={2000} leaveDelay={200} placement="top" enterNextDelay={2000}>
        <>
          <Controller control={control} name={name} render={controllerRenderer} />
          {Boolean(errorMessage) && (
            <FormHelperText>{typeof errorMessage === 'string' ? errorMessage : undefined}</FormHelperText>
          )}
        </>
      </Tooltip>
    </FormControl>
  );
}
