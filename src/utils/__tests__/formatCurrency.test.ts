import { formatCurrency } from '@Lib/formatters/formatCurrency';
import { describe, it, expect } from 'vitest';

describe('formatCurrency', () => {
  it('should format a positive number as USD by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format a negative number as USD by default', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should format a number with a specified locale', () => {
    expect(formatCurrency(1234.56, 'de-DE', 'EUR')).toBe('1.234,56 €'); // German locale
    expect(formatCurrency(1234.56, 'ja-JP', 'JPY')).toBe('￥1,235'); // Japanese Yen
  });

  it('should format a number with a specified currency', () => {
    expect(formatCurrency(1234.56, 'en-US', 'EUR')).toBe('€1,234.56'); // Euro
    expect(formatCurrency(1234.56, 'en-US', 'GBP')).toBe('£1,234.56'); // British Pound
    expect(formatCurrency(1234.56, 'en-US', 'JPY')).toBe('¥1,235'); // Japanese Yen
  });

  it('should handle large numbers correctly', () => {
    expect(formatCurrency(123456789.01)).toBe('$123,456,789.01');
  });

  it('should handle small numbers correctly', () => {
    expect(formatCurrency(0.01)).toBe('$0.01');
    expect(formatCurrency(0.0001)).toBe('$0.00'); // Rounded down
  });

  it('should handle zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
