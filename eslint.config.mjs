import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { configs as tsConfigs } from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import pluginNext from '@next/eslint-plugin-next';
import globals from 'globals';

export default [
  // 1) A general config for all files
  {
    ignores: ['node_modules', 'dist'],
    // optional base config
    ...js.configs.recommended,
  },

  // 2) A specialized config for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      // The new "languageOptions.parser" field (instead of "parser")
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      // Instead of top-level "plugins", you specify them in each config object
      '@typescript-eslint': tsPlugin,
      '@next/next': pluginNext,
      react: reactPlugin,
      prettier: prettierPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // Start with recommended rules from @typescript-eslint
      ...tsConfigs.recommended.rules,
      ...pluginNext.configs.recommended.rules,

      // React recommended (can also spread reactPlugin.configs.recommended if you want)
      ...reactPlugin.configs.recommended.rules,

      // Prettier config turns off rules that conflict with Prettier
      ...configPrettier.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];
