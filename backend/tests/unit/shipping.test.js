/**
 * Unit tests for shipping calculation
 * Tests county lookup and shipping fee calculation
 */

describe('Shipping Calculation', () => {
  // Shipping rates table (mirrors client/backend)
  const shippingRates = {
    Nairobi: 0,
    Mombasa: 150,
    Kisumu: 200,
    Nakuru: 180,
    Eldoret: 220,
    Nyeri: 250,
    Muranga: 180,
    Machakos: 120,
    Kiambu: 100,
    Bomet: 300,
    Kericho: 280,
    Homabay: 250,
    Migori: 280,
    Kisii: 260,
    Nyamira: 270,
    Narok: 290,
    Kajiado: 140,
    Uasin_Gishu: 240,
  };

  const MIN_FREE_SHIPPING = 5000;
  const DEFAULT_SHIPPING = 300;

  const calculateShipping = (county) => {
    if (!county) return DEFAULT_SHIPPING;
    const rate = shippingRates[county];
    return rate !== undefined ? rate : DEFAULT_SHIPPING;
  };

  describe('County Lookup', () => {
    test('should return 0 for Nairobi (free shipping)', () => {
      expect(calculateShipping('Nairobi')).toBe(0);
    });

    test('should return 150 for Mombasa', () => {
      expect(calculateShipping('Mombasa')).toBe(150);
    });

    test('should return 200 for Kisumu', () => {
      expect(calculateShipping('Kisumu')).toBe(200);
    });

    test('should return 100 for Kiambu', () => {
      expect(calculateShipping('Kiambu')).toBe(100);
    });

    test('should return 300 (default) for unknown county', () => {
      expect(calculateShipping('UnknownCounty')).toBe(DEFAULT_SHIPPING);
    });

    test('should return 300 (default) for empty county', () => {
      expect(calculateShipping('')).toBe(DEFAULT_SHIPPING);
    });

    test('should return 300 (default) for null county', () => {
      expect(calculateShipping(null)).toBe(DEFAULT_SHIPPING);
    });
  });

  describe('Free Shipping Threshold', () => {
    test('should apply free shipping for subtotal >= 5000', () => {
      const subtotal = 5000;
      const shipping = subtotal >= MIN_FREE_SHIPPING ? 0 : calculateShipping('Mombasa');
      expect(shipping).toBe(0);
    });

    test('should apply free shipping for subtotal > 5000', () => {
      const subtotal = 5500;
      const shipping = subtotal >= MIN_FREE_SHIPPING ? 0 : calculateShipping('Mombasa');
      expect(shipping).toBe(0);
    });

    test('should charge shipping for subtotal < 5000', () => {
      const subtotal = 4999;
      const shipping = subtotal >= MIN_FREE_SHIPPING ? 0 : calculateShipping('Mombasa');
      expect(shipping).toBe(150);
    });

    test('should not charge shipping for subtotal = 5000', () => {
      const subtotal = 5000;
      const shipping = subtotal >= MIN_FREE_SHIPPING ? 0 : calculateShipping('Mombasa');
      expect(shipping).toBe(0);
    });

    test('should charge shipping for subtotal = 4999.99', () => {
      const subtotal = 4999.99;
      const shipping = subtotal >= MIN_FREE_SHIPPING ? 0 : calculateShipping('Mombasa');
      expect(shipping).toBe(150);
    });
  });

  describe('Edge Cases', () => {
    test('should handle case-sensitive county names', () => {
      expect(calculateShipping('nairobi')).toBe(DEFAULT_SHIPPING); // lowercase not found
      expect(calculateShipping('Nairobi')).toBe(0); // correct case found
    });

    test('should handle county with spaces', () => {
      expect(calculateShipping('Nairobi ')).toBe(DEFAULT_SHIPPING); // trailing space
      expect(calculateShipping(' Nairobi')).toBe(DEFAULT_SHIPPING); // leading space
    });

    test('should handle all counties in the table', () => {
      Object.keys(shippingRates).forEach((county) => {
        const rate = calculateShipping(county);
        expect(rate).toBe(shippingRates[county]);
      });
    });

    test('should return numeric values (not strings)', () => {
      const shipping = calculateShipping('Nairobi');
      expect(typeof shipping).toBe('number');
      expect(isNaN(shipping)).toBe(false);
    });

    test('should return non-negative values', () => {
      Object.keys(shippingRates).forEach((county) => {
        const rate = calculateShipping(county);
        expect(rate).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Shipping in Order Context', () => {
    test('should calculate total correctly with shipping', () => {
      const subtotal = 1000;
      const tax = subtotal * 0.16;
      const shipping = calculateShipping('Mombasa');
      const total = subtotal + tax + shipping;

      expect(total).toBe(1000 + 160 + 150);
    });

    test('should apply free shipping when order qualifies', () => {
      const subtotal = 5000;
      const tax = subtotal * 0.16;
      const shipping = subtotal >= MIN_FREE_SHIPPING ? 0 : calculateShipping('Mombasa');
      const total = subtotal + tax + shipping;

      expect(shipping).toBe(0);
      expect(total).toBe(5000 + 800);
    });

    test('should charge shipping when order does not qualify for free', () => {
      const subtotal = 4500;
      const tax = subtotal * 0.16;
      const shipping = subtotal >= MIN_FREE_SHIPPING ? 0 : calculateShipping('Nairobi');
      const total = subtotal + tax + shipping;

      expect(shipping).toBe(0); // Nairobi is free regardless
      expect(total).toBe(4500 + 720);
    });
  });
});
