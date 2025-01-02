import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname manually since it's not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = true;
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@Playwright': path.resolve(__dirname, 'tests'),
      '@Generated': path.resolve(__dirname, 'src/generated'),
      '@Utils': path.resolve(__dirname, 'src/utils'),
      '@Redux': path.resolve(__dirname, 'src/redux'),
      '@Providers': path.resolve(__dirname, 'src/providers'),
      '@Lib': path.resolve(__dirname, 'src/lib'),
      '@Hooks': path.resolve(__dirname, 'src/hooks'),
      '@Features': path.resolve(__dirname, 'src/features'),
      '@Connected-components': path.resolve(__dirname, 'src/connected-components'),
      '@Components': path.resolve(__dirname, 'src/components'),
      '@App': path.resolve(__dirname, 'app'),
      '@Src': path.resolve(__dirname, 'src'),
      '@Root': path.resolve(__dirname, '.'),
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
  },
  images: {
    remotePatterns: [],
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: '', // TODO FIX ME
  project: '', // TODO FIX ME

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
