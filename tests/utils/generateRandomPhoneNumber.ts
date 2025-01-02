/**
 * Generates a random 10-digit phone number.
 * @returns {string} A random phone number as a string.
 */
export function generateRandomPhoneNumber(): string {
  const phoneNumberLength = 10; // Standard 10-digit phone number
  let phoneNumber = '336';

  for (let i = phoneNumber.length; i < phoneNumberLength; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit between 0-9
    phoneNumber += randomDigit.toString();
  }

  return phoneNumber;
}
