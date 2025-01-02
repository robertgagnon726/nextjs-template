'use client';
import { Roboto } from 'next/font/google';

import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#0b3d2c', // Dark green, like the lush grass
    },
    secondary: {
      main: '#729f28', // Deep sky blue, reflecting a clear day
    },
    error: {
      main: '#d32f2f', // For contrast
    },
    background: {
      default: '#fcfcfc', // A light gray, for cleanliness and modern feel
      paper: '#ffffff', // Pure white, to allow content to stand out
    },
    text: {
      primary: '#2e2e2e', // Almost black for high readability
      secondary: '#6e6e6e', // A medium gray for secondary text
    },
  },
});

export default theme;
