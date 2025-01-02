import { isValidDate } from '@Lib/validators/isValidDate';
import { describe, it, expect } from 'vitest';

describe('isValidDate', () => {
  it('should return true for valid date strings in ISO format', () => {
    expect(isValidDate('2023-11-19')).toBe(true);
    expect(isValidDate('2020-02-29')).toBe(true); // Leap year
    expect(isValidDate('2000-01-01')).toBe(true); // Edge case: Start of millennium
    expect(isValidDate('2021-12-31')).toBe(true); // End of year
  });

  it('should return false for invalid date strings', () => {
    expect(isValidDate('2023-02-29')).toBe(false); // Invalid date: Not a leap year
    expect(isValidDate('2023-13-01')).toBe(false); // Invalid month
    expect(isValidDate('2023-00-10')).toBe(false); // Invalid month
    expect(isValidDate('2023-01-32')).toBe(false); // Invalid day
    expect(isValidDate('2023-04-31')).toBe(false); // Invalid day in April
  });

  it('should return false for non-ISO formatted date strings', () => {
    expect(isValidDate('19-11-2023')).toBe(false); // DD-MM-YYYY format
    expect(isValidDate('11/19/2023')).toBe(false); // MM/DD/YYYY format
    expect(isValidDate('2023.11.19')).toBe(false); // Period-separated
    expect(isValidDate('19th November 2023')).toBe(false); // Natural language
  });

  it('should return false for non-date strings', () => {
    expect(isValidDate('')).toBe(false); // Empty string
    expect(isValidDate('randomstring')).toBe(false); // Random string
    expect(isValidDate('2023-11-19T15:30:00Z')).toBe(false); // ISO datetime
  });

  it('should return false for dates with invalid separators', () => {
    expect(isValidDate('2023/11/19')).toBe(false); // Slash separator
    expect(isValidDate('2023-11.19')).toBe(false); // Mixed separator
  });

  it('should handle edge cases gracefully', () => {
    expect(isValidDate('0000-01-01')).toBe(true); // Edge case: Year zero
    expect(isValidDate('9999-12-31')).toBe(true); // Edge case: Maximum year
    expect(isValidDate('2023-11-19 ')).toBe(false); // Trailing whitespace
    expect(isValidDate(' 2023-11-19')).toBe(false); // Leading whitespace
  });
});
