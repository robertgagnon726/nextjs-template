import theme from '@/theme';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Roboto: vi.fn().mockReturnValue({
    style: {
      fontFamily: "'Roboto', sans-serif",
    },
  }),
}));

describe('Theme configuration', () => {
  it('should have the correct typography configuration', () => {
    expect(theme.typography.fontFamily).toBe("'Roboto', sans-serif");
  });

  it('should have the correct primary color', () => {
    expect(theme.palette.primary.main).toBe('#0b3d2c');
  });

  it('should have the correct secondary color', () => {
    expect(theme.palette.secondary.main).toBe('#729f28');
  });

  it('should have the correct error color', () => {
    expect(theme.palette.error.main).toBe('#d32f2f');
  });

  it('should have the correct background colors', () => {
    expect(theme.palette.background.default).toBe('#fcfcfc');
    expect(theme.palette.background.paper).toBe('#ffffff');
  });

  it('should have the correct text colors', () => {
    expect(theme.palette.text.primary).toBe('#2e2e2e');
    expect(theme.palette.text.secondary).toBe('#6e6e6e');
  });
});
