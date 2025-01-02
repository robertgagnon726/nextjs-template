import { first, join, initial, last } from 'lodash';

/**
 * Converts an array of strings into a single string with an Oxford comma.
 * @returns {string} The joined string with an Oxford comma.
 */
export function oxfordCommaList(array: string[]): string {
  const length = array.length;

  if (length === 0) return '';
  if (length === 1) return first(array) as string;
  if (length === 2) return array.join(' and ');

  // Combine all elements with commas, and add "and" before the last element
  return `${join(initial(array), ', ')}, and ${last(array)}`;
}
