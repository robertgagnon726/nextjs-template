/**
 * Formats a phone number into (XXX) XXX-XXXX format.
 * @param {string} phoneNumber - The raw phone number (digits only).
 * @returns {string} - The formatted phone number or an error message if invalid.
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the cleaned number has 10 digits
  if (cleaned.length !== 10) {
    return 'Invalid phone number';
  }

  // Format the number as (XXX) XXX-XXXX
  const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  return formatted;
}
