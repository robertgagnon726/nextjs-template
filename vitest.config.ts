import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      exclude: ['public', 'scripts', 'src/generated'],
      include: ['src/components', 'src/connected-components', 'src/hooks', 'src/utils'],
      provider: 'v8', // Ensures Istanbul is used for coverage
      reporter: ['text', 'lcov'],
      all: true,
      reportsDirectory: 'coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        transform: {
          react: {
            runtime: 'automatic', // Add this line
          },
        },
      },
    }),
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Map "@" to the "src" directory
    },
  },
});
