/* eslint-disable no-console */
import '@testing-library/jest-dom';
import chalk from 'chalk';
import { beforeEach, afterEach, expect } from 'vitest';

// Store logs for each test case
let testErrors: string[] = [];
let testWarnings: string[] = [];

// Define specific types for message and args
type ConsoleMessage = string | Error;
type ConsoleArgs = unknown[];

// Keep original console methods
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  // Reset the logs before each test
  testErrors = [];
  testWarnings = [];

  console.error = (message: ConsoleMessage, ...args: ConsoleArgs) => {
    if (typeof message === 'string' && (message.includes('not wrapped in act(...)') || message.includes('Warning:'))) {
      const error = new Error(message);
      // Remove the first line (Error message) and filter stack frames
      const stackLines = (error.stack ?? '').split('\n').slice(1);
      const relevantStack = stackLines
        .filter(
          (line) =>
            !line.includes('node_modules') && !line.includes('console.error') && !line.includes('setupTests.ts'), // Exclude the setup file itself
        )
        .join('\n');

      testErrors.push(
        `${chalk.red.bold('[ERROR]')} ${chalk.whiteBright(message)}\n` +
          `${chalk.gray('[STACK TRACE]')} ${chalk.gray(relevantStack)}\n`,
      );
    }
    originalError.apply(console, [message, ...args]);
  };

  console.warn = (message: ConsoleMessage, ...args: ConsoleArgs) => {
    if (
      typeof message === 'string' &&
      (message.includes('Warning:') || message.includes('MUI: You have provided an out-of-range value'))
    ) {
      const error = new Error(message);
      // Remove the first line (Error message) and filter stack frames
      const stackLines = (error.stack ?? '').split('\n').slice(1);
      const relevantStack = stackLines
        .filter(
          (line) => !line.includes('node_modules') && !line.includes('console.warn') && !line.includes('setupTests.ts'), // Exclude the setup file itself
        )
        .join('\n');

      testWarnings.push(
        `${chalk.yellow.bold('[WARNING]')} ${chalk.whiteBright(message)}\n` +
          `${chalk.gray('[STACK TRACE]')} ${chalk.gray(relevantStack)}\n`,
      );
    }
    originalWarn.apply(console, [message, ...args]);
  };
});

afterEach((testContext) => {
  // Use `testContext.task.name` to get the current test name
  const testName = testContext.task.name;
  const messages = [];

  if (testErrors.length > 0) {
    const errorMessage = `${chalk.red.bold(`\n❌ [ERRORS in ${testName}]:\n`)}${testErrors.join('\n')}`;
    messages.push(errorMessage);
  }

  if (testWarnings.length > 0) {
    const warningMessage = `${chalk.yellow.bold(`\n⚠️ [WARNINGS in ${testName}]:\n`)}${testWarnings.join('\n')}`;
    messages.push(warningMessage);
  }

  if (messages.length > 0) {
    // Use expect.fail to fail the test and include the messages
    expect.fail(messages.join('\n'));
  }
});
