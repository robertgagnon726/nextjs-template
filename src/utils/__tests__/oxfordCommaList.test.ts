import { oxfordCommaList } from '@Utils/oxfordCommaList';
import { describe, it, expect } from 'vitest';

describe('oxfordCommaList', () => {
  it('should return an empty string for an empty array', () => {
    const result = oxfordCommaList([]);
    expect(result).toBe('');
  });

  it('should return the only element for an array with one item', () => {
    const result = oxfordCommaList(['Apple']);
    expect(result).toBe('Apple');
  });

  it('should join two elements with "and"', () => {
    const result = oxfordCommaList(['Apple', 'Banana']);
    expect(result).toBe('Apple and Banana');
  });

  it('should join three elements with commas and an Oxford comma', () => {
    const result = oxfordCommaList(['Apple', 'Banana', 'Cherry']);
    expect(result).toBe('Apple, Banana, and Cherry');
  });

  it('should join multiple elements with commas and an Oxford comma', () => {
    const result = oxfordCommaList(['Apple', 'Banana', 'Cherry', 'Date']);
    expect(result).toBe('Apple, Banana, Cherry, and Date');
  });

  it('should handle an array with repeated elements', () => {
    const result = oxfordCommaList(['Apple', 'Apple', 'Banana']);
    expect(result).toBe('Apple, Apple, and Banana');
  });

  it('should handle an array with special characters', () => {
    const result = oxfordCommaList(['Apple', 'Banana', 'Cherry & Date']);
    expect(result).toBe('Apple, Banana, and Cherry & Date');
  });

  it('should handle an array with empty strings', () => {
    const result = oxfordCommaList(['Apple', '', 'Banana']);
    expect(result).toBe('Apple, , and Banana');
  });

  it('should handle an array with numeric strings', () => {
    const result = oxfordCommaList(['1', '2', '3']);
    expect(result).toBe('1, 2, and 3');
  });
});
