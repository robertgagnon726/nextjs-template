import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';

export interface ValueMap {
  [key: string]: string | number | undefined | null | ReactElement;
}

interface DetailCenterAlignedProps {
  values: ValueMap;
}

/**
 * A React functional component that displays key-value pairs in a center-aligned layout.
 * Each key-value pair is displayed in a row with the key on the right and the value on the left.
 */
export const DetailCenterAligned = ({ values }: DetailCenterAlignedProps) => {
  return (
    <Box>
      {Object.keys(values).map((key) => (
        <Box key={key} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            sx={{ width: '50%', textAlign: 'right', paddingRight: 1, color: (theme) => theme.palette.grey[600] }}
          >
            {key}
          </Typography>
          <Typography sx={{ width: '50%', textAlign: 'left' }}>{values[key] ?? '-'}</Typography>
        </Box>
      ))}
    </Box>
  );
};
