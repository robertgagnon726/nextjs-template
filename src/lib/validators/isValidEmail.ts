import { isEmail } from 'validator';
/**
 * Checks if the provided email is valid.
 */

export function isValidEmail(email: string) {
  return isEmail(email);
}
