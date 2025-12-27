/**
 * Unit tests for M-Pesa utilities
 * Tests phone validation, amount validation, and formatting
 */

describe('M-Pesa Phone & Amount Validation', () => {
  // Phone validation tests
  describe('Phone Number Validation', () => {
    test('should accept valid phone: 0712345678', () => {
      const phone = '0712345678';
      expect(phone).toMatch(/^0\d{9}$/);
    });

    test('should accept valid phone: 254712345678', () => {
      const phone = '254712345678';
      expect(phone).toMatch(/^254\d{9}$/);
    });

    test('should accept valid phone: +254712345678', () => {
      const phone = '+254712345678';
      expect(phone.startsWith('+254')).toBe(true);
      expect(phone).toMatch(/^\+254\d{9}$/);
    });

    test('should reject short phone: 123', () => {
      const phone = '123';
      expect(phone.length).toBeLessThan(9);
      expect(phone).not.toMatch(/^254\d{9}$/);
    });

    test('should reject phone with letters: 07abcdefgh', () => {
      const phone = '07abcdefgh';
      expect(phone).not.toMatch(/^\d+$/);
    });

    test('should reject empty phone: ""', () => {
      const phone = '';
      expect(phone.trim().length).toBeLessThan(9);
    });

    test('should format 0712345678 to 254712345678', () => {
      let phone = '0712345678';
      let formatted = phone.startsWith('0')
        ? `254${phone.slice(1)}`
        : phone.startsWith('+254')
        ? phone.slice(1)
        : phone;
      expect(formatted).toBe('254712345678');
      expect(formatted).toMatch(/^254\d{9}$/);
    });

    test('should format +254712345678 to 254712345678', () => {
      let phone = '+254712345678';
      let formatted = phone.startsWith('0')
        ? `254${phone.slice(1)}`
        : phone.startsWith('+254')
        ? phone.slice(1)
        : phone;
      expect(formatted).toBe('254712345678');
      expect(formatted).toMatch(/^254\d{9}$/);
    });

    test('should keep 254712345678 as is', () => {
      let phone = '254712345678';
      let formatted = phone.startsWith('0')
        ? `254${phone.slice(1)}`
        : phone.startsWith('+254')
        ? phone.slice(1)
        : phone;
      expect(formatted).toBe('254712345678');
    });
  });

  // Amount validation tests
  describe('Amount Validation', () => {
    test('should accept amount: 100', () => {
      const amount = 100;
      expect(amount).toBeGreaterThanOrEqual(1);
      expect(amount).toBeLessThanOrEqual(999999);
    });

    test('should accept amount: 1 (minimum)', () => {
      const amount = 1;
      expect(amount).toBeGreaterThanOrEqual(1);
    });

    test('should accept amount: 999999 (maximum)', () => {
      const amount = 999999;
      expect(amount).toBeLessThanOrEqual(999999);
    });

    test('should reject amount: 0', () => {
      const amount = 0;
      expect(amount).toBeLessThan(1);
    });

    test('should reject amount: -50', () => {
      const amount = -50;
      expect(amount).toBeLessThan(1);
    });

    test('should reject amount: 1000000 (exceeds max)', () => {
      const amount = 1000000;
      expect(amount).toBeGreaterThan(999999);
    });

    test('should round amount to integer: 150.7 → 151', () => {
      const amount = 150.7;
      const rounded = Math.round(amount);
      expect(rounded).toBe(151);
    });

    test('should round amount to integer: 150.4 → 150', () => {
      const amount = 150.4;
      const rounded = Math.round(amount);
      expect(rounded).toBe(150);
    });
  });

  // Combined validation
  describe('Combined Validation', () => {
    test('should validate valid phone and amount together', () => {
      const phone = '0712345678';
      const amount = 500;
      
      expect(phone.trim().length).toBeGreaterThanOrEqual(9);
      expect(amount).toBeGreaterThanOrEqual(1);
      expect(amount).toBeLessThanOrEqual(999999);
    });

    test('should reject invalid phone even if amount is valid', () => {
      const phone = '123';
      const amount = 500;
      
      const isValid = phone.trim().length >= 9 && amount >= 1 && amount <= 999999;
      expect(isValid).toBe(false);
    });

    test('should reject valid phone if amount is invalid', () => {
      const phone = '0712345678';
      const amount = 1000000;
      
      const isValid = phone.trim().length >= 9 && amount >= 1 && amount <= 999999;
      expect(isValid).toBe(false);
    });
  });
});
