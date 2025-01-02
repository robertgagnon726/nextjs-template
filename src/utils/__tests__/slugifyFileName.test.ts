import { slugifyFileName } from '@Utils/slugifyFileName';
import { describe, it, expect } from 'vitest';

describe('slugifyFileName', () => {
  it('should return a slugified file name with the same extension', () => {
    const result = slugifyFileName('My File Name.txt');
    expect(result).toBe('my-file-name.txt');
  });

  it('should handle file names with multiple dots correctly', () => {
    const result = slugifyFileName('My.File.Name.with.Dots.pdf');
    expect(result).toBe('my-file-name-with-dots.pdf');
  });

  it('should remove special characters and replace them with hyphens', () => {
    const result = slugifyFileName('Special!@#Characters%^&Name.jpg');
    expect(result).toBe('special-characters-name.jpg');
  });

  it('should remove leading and trailing hyphens from the slugified name', () => {
    const result = slugifyFileName('---Extra---Hyphens---.png');
    expect(result).toBe('extra-hyphens.png');
  });

  it('should handle names with spaces and special characters', () => {
    const result = slugifyFileName('  Spaces and **Special** Characters.txt  ');
    expect(result).toBe('spaces-and-special-characters.txt');
  });

  it('should handle an already slugified name', () => {
    const result = slugifyFileName('already-slugified-name.jpg');
    expect(result).toBe('already-slugified-name.jpg');
  });

  it('should handle an empty string gracefully', () => {
    const result = slugifyFileName('');
    expect(result).toBeUndefined();
  });

  it('should preserve numeric names correctly', () => {
    const result = slugifyFileName('1234567890.docx');
    expect(result).toBe('1234567890.docx');
  });

  it('should handle uppercase extensions correctly', () => {
    const result = slugifyFileName('FileWithUppercaseExtension.PNG');
    expect(result).toBe('filewithuppercaseextension.PNG');
  });
});
