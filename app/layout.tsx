import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import { Montserrat } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ReduxProvider } from '@/redux/ReduxProvider';
import { Metadata } from 'next';
import theme from '@/theme';
import { ReactNode } from 'react';

const montserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | {{default}}', // TODO FIX ME
    default: '{{default}}', // TODO FIX ME
  },
  description: '{{default}}', // TODO FIX ME
  icons: [
    {
      rel: 'icon',
      url: '/favicon-dark.svg',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      url: '/favicon-light.svg',
      media: '(prefers-color-scheme: dark)',
    },
  ],
};

/**
 * RootLayout component that sets up the main layout for the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <body style={{ margin: '0px' }} suppressHydrationWarning>
            <ReduxProvider>{children}</ReduxProvider>
          </body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
