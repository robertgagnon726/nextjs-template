import { preventInvalidChars } from '@Components/Inputs/FormCurrencyTextField';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

export type BaseCurrencyFieldProps = {
  tooltip?: string;
  tooltipEnterDelay?: number;
} & TextFieldProps;

export const CurrencyTextField = ({
  label,
  tooltip,
  tooltipEnterDelay = 2000,
  ...textFieldProps
}: BaseCurrencyFieldProps) => {
  return (
    <Tooltip title={tooltip || ''} arrow enterDelay={tooltipEnterDelay} leaveDelay={200} placement="top">
      <TextField
        {...textFieldProps}
        label={label}
        fullWidth
        onKeyDown={preventInvalidChars}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
    </Tooltip>
  );
};
