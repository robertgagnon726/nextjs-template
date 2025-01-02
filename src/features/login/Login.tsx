'use client';

import { ThemeProvider, useTheme } from '@mui/material';

export const Login = () => {
  const theme = useTheme();

  return <ThemeProvider theme={theme}></ThemeProvider>;
};
