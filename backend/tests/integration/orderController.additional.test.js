import { jest } from '@jest/globals';
import { createOrder } from '../../controllers/orderController.js';
import Order from '../../models/Order.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Order Controller - Additional Coverage', () => {
  beforeEach(() => jest.clearAllMocks());

  test('createOrder with invalid shipping info', async () => {
    const req = { 
      user: { _id: 'u1' }, 
      body: { items: [{ productId: 'p1', price: 100, quantity: 1 }], cartTotals: { subtotal: 100, shipping: 0, tax: 16, total: 116 } }
    };
    const res = makeRes();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('createOrder with valid fields creates order', async () => {
    Order.create = jest.fn().mockResolvedValue({ _id: 'order1' });

    const req = { 
      user: { _id: 'u1' }, 
      body: { 
        shippingInfo: { city: 'Nairobi' }, 
        paymentMethod: 'mpesa',
        items: [{ productId: 'p1', price: 100, quantity: 1 }], 
        cartTotals: { subtotal: 100, shipping: 0, tax: 16, total: 116 }
      },
      ip: '1.1.1.1',
      get: () => 'ua'
    };
    const res = makeRes();

    await createOrder(req, res);

    expect(Order.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
