import { describe, it, expect } from 'vitest';
import { isEmail } from 'validator';
import { isValidEmail } from '@Lib/validators/isValidEmail';

describe('isValidEmail with validator.js', () => {
  it('should match validator.js isEmail function', () => {
    const testEmails = [
      'test@example.com',
      'user.name+tag+sorting@example.com',
      'x@example.com',
      'user@sub.example.com',
      'user@123.123.123.123',
      'user@[IPv6:2001:db8::1]',
      'user@domain.c',
      'user@domain.toolongtld',
      '', // Invalid
      'plainaddress', // Invalid
      '@example.com', // Invalid
      'user@.com', // Invalid
      'user@com', // Invalid
      'user@sub..example.com', // Invalid
      'user@@example.com', // Invalid
      'user@ example .com', // Invalid
      'user@.', // Invalid
      'user@-example.com', // Invalid
      'user@domain..com', // Invalid
      'user@-domain.com', // Invalid
      'user@domain-.com', // Invalid
      'user@domain.com-', // Invalid
    ];

    testEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(isEmail(email));
    });
  });
});
