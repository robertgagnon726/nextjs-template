/**
 * Checks if a given date string is a valid date.
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);

  // Check if the date is valid by confirming the date object is not "Invalid Date" and the string can be parsed
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
}
