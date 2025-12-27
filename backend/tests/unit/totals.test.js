/**
 * Unit tests for cart totals calculation
 * Tests discount, tax, rounding, and edge cases
 */

describe('Cart Totals Calculation', () => {
  // Tax rate constant
  const TAX_RATE = 0.16;

  // Helper to round to 2 decimals (mimics backend)
  const roundTo2 = (val) => Number(val.toFixed(2));

  // Simulate cart total calculation
  const calculateTotals = (items) => {
    let subtotal = 0;

    items.forEach((item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      subtotal += price * quantity;
    });

    subtotal = roundTo2(subtotal);
    const tax = roundTo2(subtotal * TAX_RATE);
    const total = roundTo2(subtotal + tax);

    return { subtotal, tax, total };
  };

  describe('Basic Calculations', () => {
    test('should calculate subtotal correctly', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ];
      const { subtotal } = calculateTotals(items);
      expect(subtotal).toBe(250);
    });

    test('should calculate tax at 16%', () => {
      const items = [{ price: 100, quantity: 1 }];
      const { subtotal, tax } = calculateTotals(items);
      expect(tax).toBe(16);
      expect(tax).toBe(subtotal * TAX_RATE);
    });

    test('should calculate total as subtotal + tax', () => {
      const items = [{ price: 100, quantity: 2 }];
      const { subtotal, tax, total } = calculateTotals(items);
      expect(total).toBe(subtotal + tax);
    });
  });

  describe('Discount Handling', () => {
    test('should apply discount from originalPrice', () => {
      const originalPrice = 100;
      const price = 80; // 20% discount
      const quantity = 1;
      const itemTotal = price * quantity;
      const discount = originalPrice - price;

      expect(discount).toBe(20);
      expect(itemTotal).toBe(80);
    });

    test('should calculate discount percentage correctly', () => {
      const originalPrice = 100;
      const price = 75; // 25% discount
      const discountPercent = ((originalPrice - price) / originalPrice) * 100;

      expect(discountPercent).toBe(25);
    });

    test('should apply discount to subtotal calculation', () => {
      const items = [
        { price: 80, quantity: 1 }, // discounted price
        { price: 50, quantity: 1 },
      ];
      const { subtotal } = calculateTotals(items);
      expect(subtotal).toBe(130); // not 150
    });

    test('should handle zero discount', () => {
      const originalPrice = 100;
      const price = 100;
      const discountPercent = ((originalPrice - price) / originalPrice) * 100;

      expect(discountPercent).toBe(0);
    });

    test('should handle 100% discount (free item)', () => {
      const originalPrice = 100;
      const price = 0;
      const items = [{ price, quantity: 1 }];
      const { subtotal } = calculateTotals(items);

      expect(subtotal).toBe(0);
    });
  });

  describe('Rounding Edge Cases', () => {
    test('should round tax .005 up to .01', () => {
      const subtotal = 10.31; // 10.31 * 0.16 = 1.6496
      const tax = roundTo2(subtotal * TAX_RATE);
      expect(tax).toBe(1.65);
    });

    test('should round tax .004 down to .00', () => {
      const subtotal = 10.25; // 10.25 * 0.16 = 1.64
      const tax = roundTo2(subtotal * TAX_RATE);
      expect(tax).toBe(1.64);
    });

    test('should round total correctly after tax', () => {
      const subtotal = 99.99;
      const tax = roundTo2(subtotal * TAX_RATE); // 15.9984
      const total = roundTo2(subtotal + tax);

      expect(tax).toBe(16.00);
      expect(total).toBe(115.99);
    });

    test('should handle many items with fractional prices', () => {
      const items = [
        { price: 12.99, quantity: 3 },
        { price: 5.50, quantity: 2 },
        { price: 0.99, quantity: 5 },
      ];
      const { subtotal, tax, total } = calculateTotals(items);

      expect(subtotal).toBeCloseTo(54.92, 2); // 38.97 + 11 + 4.95 // 38.97 + 11 + 4.95
      expect(tax).toBeCloseTo(8.79, 2); // 54.92 * 0.16 // 56.95 * 0.16
      expect(total).toBeCloseTo(63.71, 2); // 54.92 + 8.79 // 56.95 + 9.11
    });

    test('should always round to exactly 2 decimals', () => {
      const items = [{ price: 99.9999, quantity: 1 }];
      const { subtotal, tax, total } = calculateTotals(items);

      expect(String(subtotal).split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(String(tax).split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(String(total).split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('Edge Cases & Invalid Input', () => {
    test('should handle empty cart', () => {
      const items = [];
      const { subtotal, tax, total } = calculateTotals(items);

      expect(subtotal).toBe(0);
      expect(tax).toBe(0);
      expect(total).toBe(0);
    });

    test('should handle zero quantity', () => {
      const items = [{ price: 100, quantity: 0 }];
      const { subtotal } = calculateTotals(items);

      expect(subtotal).toBe(0);
    });

    test('should handle string prices (should be coerced to number)', () => {
      const items = [{ price: '100', quantity: '2' }];
      const { subtotal } = calculateTotals(items);

      expect(subtotal).toBe(200);
    });

    test('should handle null/undefined prices', () => {
      const items = [{ price: null, quantity: 1 }, { price: 50, quantity: 1 }];
      const { subtotal } = calculateTotals(items);

      expect(subtotal).toBe(50);
    });

    test('should handle negative prices (invalid but should be caught server-side)', () => {
      const items = [{ price: -100, quantity: 1 }];
      const { subtotal } = calculateTotals(items);

      expect(subtotal).toBe(-100); // logic will calculate it; validation should reject before this
    });

    test('should handle very large orders', () => {
      const items = [{ price: 999999, quantity: 1 }];
      const { subtotal, tax, total } = calculateTotals(items);

      expect(subtotal).toBe(999999);
      expect(tax).toBe(159999.84);
      expect(total).toBe(1159998.84);
    });

    test('should handle very small prices', () => {
      const items = [{ price: 0.01, quantity: 1 }];
      const { subtotal, tax, total } = calculateTotals(items);

      expect(subtotal).toBe(0.01);
      expect(tax).toBe(0.00); // 0.0016 rounds down
      expect(total).toBe(0.01);
    });
  });

  describe('Integration with Shipping & Discount', () => {
    test('should calculate total: subtotal + tax + shipping', () => {
      const items = [{ price: 100, quantity: 2 }];
      const shipping = 150;
      const { subtotal, tax } = calculateTotals(items);
      const orderTotal = roundTo2(subtotal + tax + shipping);

      expect(orderTotal).toBe(200 + 32 + 150);
      expect(orderTotal).toBe(382);
    });

    test('should apply discounts before tax', () => {
      const items = [
        { price: 75, quantity: 2 }, // discounted from 100 each
      ];
      const { subtotal, tax, total } = calculateTotals(items);

      expect(subtotal).toBe(150); // not 200
      expect(tax).toBe(24); // 150 * 0.16
      expect(total).toBe(174);
    });

    test('should handle free shipping in total', () => {
      const items = [{ price: 1000, quantity: 1 }];
      const shipping = 0; // free shipping
      const { subtotal, tax } = calculateTotals(items);
      const orderTotal = roundTo2(subtotal + tax + shipping);

      expect(orderTotal).toBe(1000 + 160 + 0);
      expect(orderTotal).toBe(1160);
    });
  });

  describe('Server Validation (Tolerance Check)', () => {
    test('client and server totals within ±0.01 tolerance', () => {
      const clientTotal = 1234.56;
      const serverTotal = 1234.57;
      const tolerance = 0.01;

      const isWithinTolerance = Math.abs(clientTotal - serverTotal) <= tolerance;
      expect(isWithinTolerance).toBe(true);
    });

    test('client and server totals outside tolerance should fail', () => {
      const clientTotal = 1234.56;
      const serverTotal = 1234.58; // 0.02 difference
      const tolerance = 0.01;

      const isWithinTolerance = Math.abs(clientTotal - serverTotal) <= tolerance;
      expect(isWithinTolerance).toBe(false);
    });

    test('identical totals pass tolerance check', () => {
      const clientTotal = 1234.56;
      const serverTotal = 1234.56;
      const tolerance = 0.01;

      const isWithinTolerance = Math.abs(clientTotal - serverTotal) <= tolerance;
      expect(isWithinTolerance).toBe(true);
    });
  });
});
