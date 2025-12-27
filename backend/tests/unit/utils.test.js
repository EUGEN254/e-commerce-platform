import { jest } from '@jest/globals';
import validatePassword from '../../utils/validatePassword.js';
import { getTimestamp, generatePassword } from '../../utils/mpesa.js';

describe('Utilities', () => {
  // validatePassword tests
  describe('validatePassword', () => {
    test('should accept valid password', () => {
      const result = validatePassword('SecurePass123!');
      expect(result.isValid).toBe(true);
    });

    test('should reject password without uppercase', () => {
      const result = validatePassword('securepass123!');
      expect(result.isValid).toBe(false);
    });

    test('should reject password without lowercase', () => {
      const result = validatePassword('SECUREPASS123!');
      expect(result.isValid).toBe(false);
    });

    test('should reject password without number', () => {
      const result = validatePassword('SecurePass!');
      expect(result.isValid).toBe(false);
    });

    test('should reject password without special character', () => {
      const result = validatePassword('SecurePass123');
      expect(result.isValid).toBe(false);
    });

    test('should reject password shorter than 8 chars', () => {
      const result = validatePassword('Pass1!');
      expect(result.isValid).toBe(false);
    });
  });

  // M-Pesa timestamp tests
  describe('M-Pesa Utilities', () => {
    test('getTimestamp returns 14-char string', () => {
      const ts = getTimestamp();
      expect(ts).toHaveLength(14);
      expect(/^\d{14}$/.test(ts)).toBe(true);
    });

    test('generatePassword returns base64 string', () => {
      process.env.MPESA_SHORTCODE = '174379';
      process.env.MPESA_PASSKEY = 'bfb279f9ba9b9d4aed659321c0537a4f1e0589d3082025bb148aebf7cd9cb3c0';
      
      const pwd = generatePassword();
      expect(pwd).toBeDefined();
      expect(typeof pwd).toBe('string');
      expect(pwd.length > 0).toBe(true);
    });
  });
});
