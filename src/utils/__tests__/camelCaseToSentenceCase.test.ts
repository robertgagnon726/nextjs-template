import { camelCaseToSentenceCase } from '@Utils/camelCaseToSentenceCase';
import { describe, it, expect } from 'vitest';

describe('camelCaseToSentenceCase', () => {
  it('should convert camelCase to sentence case', () => {
    expect(camelCaseToSentenceCase('camelCaseString')).toBe('Camel case string');
    expect(camelCaseToSentenceCase('thisIsATest')).toBe('This is a test');
    expect(camelCaseToSentenceCase('helloWorld')).toBe('Hello world');
  });

  it('should handle strings with no uppercase letters', () => {
    expect(camelCaseToSentenceCase('lowercase')).toBe('Lowercase');
  });

  it('should handle strings with only one word', () => {
    expect(camelCaseToSentenceCase('Single')).toBe('Single');
  });

  it('should handle empty strings gracefully', () => {
    expect(camelCaseToSentenceCase('')).toBe('');
  });

  it('should handle strings that are already in sentence case', () => {
    expect(camelCaseToSentenceCase('Already sentence case')).toBe('Already sentence case');
  });
});
