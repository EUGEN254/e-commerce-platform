import { jest } from '@jest/globals';
import { initiateMpesaPayment, mpesaCallback } from '../../controllers/transactionController.js';
import Transaction from '../../models/Transaction.js';
import Order from '../../models/Order.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Transaction Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initiateMpesaPayment - invalid phone returns 400', async () => {
    const req = { user: { _id: 'user1' }, body: { orderId: 'o1', phoneNumber: '123' }, headers: {}, ip: '1.1.1.1', get: () => 'ua' };
    const res = makeRes();

    // Mock order not needed since validation fails earlier
    await initiateMpesaPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: expect.stringContaining('Invalid') }));
  });

  test('initiateMpesaPayment - idempotency returns existing transaction', async () => {
    const existingTx = { _id: 'tx1', reference: 'r1' };
    Transaction.findOne = jest.fn().mockResolvedValue(existingTx);

    const req = { user: { _id: 'user1' }, body: { orderId: 'o1', phoneNumber: '0712345678' }, headers: { 'idempotency-key': 'key1' }, ip: '1.1.1.1', get: () => 'ua' };
    const res = makeRes();

    // ensure findOne will find by idempotencyKey
    Transaction.findOne = jest.fn().mockResolvedValue(existingTx);

    await initiateMpesaPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('mpesaCallback - success processing updates transaction and order to PAID', async () => {
    const mockTransaction = {
      _id: 'tx1',
      amount: 100,
      callbackReceived: false,
      save: jest.fn().mockResolvedValue(true),
      orderId: 'order1',
    };

    Transaction.findOne = jest.fn().mockResolvedValue(mockTransaction);

    Order.findById = jest.fn().mockResolvedValue({ _id: 'order1', status: 'PAYMENT_PENDING', save: jest.fn().mockResolvedValue(true) });

    const body = {
      Body: {
        stkCallback: {
          CheckoutRequestID: 'ck1',
          MerchantRequestID: 'mr1',
          ResultCode: 0,
          ResultDesc: 'Success',
          CallbackMetadata: { Item: [ { Name: 'Amount', Value: 100 }, { Name: 'MpesaReceiptNumber', Value: 'ABC123' } ] }
        }
      }
    };

    const req = { body };
    const res = makeRes();

    await mpesaCallback(req, res);

    expect(Transaction.findOne).toHaveBeenCalled();
    expect(mockTransaction.save).toHaveBeenCalled();
    expect(Order.findById).toHaveBeenCalledWith('order1');
  });

  test('mpesaCallback - amount mismatch marks transaction FAILED', async () => {
    const mockTransaction = {
      _id: 'tx2',
      amount: 200,
      callbackReceived: false,
      save: jest.fn().mockResolvedValue(true),
      orderId: 'order2',
    };

    Transaction.findOne = jest.fn().mockResolvedValue(mockTransaction);

    const body = {
      Body: {
        stkCallback: {
          CheckoutRequestID: 'ck2',
          MerchantRequestID: 'mr2',
          ResultCode: 0,
          ResultDesc: 'Success',
          CallbackMetadata: { Item: [ { Name: 'Amount', Value: 100 }, { Name: 'MpesaReceiptNumber', Value: 'ABC999' } ] }
        }
      }
    };

    const req = { body };
    const res = makeRes();

    await mpesaCallback(req, res);

    expect(mockTransaction.save).toHaveBeenCalled();
    expect(mockTransaction.status).toBe('FAILED');
  });
});
