import { jest } from '@jest/globals';
import { createOrder } from '../../controllers/orderController.js';
import Order from '../../models/Order.js';

// Helper to create mock res
const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Order Controller - createOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if missing shippingInfo or items', async () => {
    const req = { user: { _id: 'user1' }, body: {} };
    const res = makeRes();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('should return 400 if cartTotals missing', async () => {
    const req = {
      user: { _id: 'user1' },
      body: { shippingInfo: { city: 'Nairobi' }, items: [{ productId: 'p1', price: 10, quantity: 1 }] },
    };
    const res = makeRes();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('should reject subtotal mismatch', async () => {
    const items = [{ productId: 'p1', price: 100, quantity: 1 }];
    const cartTotals = { subtotal: 50, shipping: 0, tax: 8, total: 58 };
    const req = { user: { _id: 'user1' }, body: { shippingInfo: { city: 'Nairobi' }, paymentMethod: 'mpesa', items, cartTotals }, ip: '1.1.1.1', get: () => 'ua' };
    const res = makeRes();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: expect.stringContaining('Subtotal mismatch') }));
  });

  test('should create order when inputs are valid', async () => {
    const items = [{ productId: 'p1', price: 100, quantity: 1 }];
    const subtotal = 100;
    const tax = Number((subtotal * 0.16).toFixed(2));
    const cartTotals = { subtotal, shipping: 0, tax, total: Number((subtotal + tax).toFixed(2)) };

    const req = { user: { _id: 'user1' }, body: { shippingInfo: { city: 'Nairobi' }, paymentMethod: 'mpesa', items, cartTotals }, ip: '1.1.1.1', get: () => 'ua' };
    const res = makeRes();

    // Mock Order.create
    Order.create = jest.fn().mockResolvedValue({ _id: 'order1', items, subtotal, tax, shippingFee: 0, totalAmount: cartTotals.total });

    await createOrder(req, res);

    expect(Order.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, order: expect.any(Object) }));
  });
});
