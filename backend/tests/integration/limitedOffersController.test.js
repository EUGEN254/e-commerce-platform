import { jest } from '@jest/globals';
import { createLimitedOffer, getLimitedOffers, getLimitedOffer } from '../../controllers/limitedOffersController.js';
import LimitedOffer from '../../models/LimitedOffer.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Limited Offers Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getLimitedOffers returns empty list when none', async () => {
    // chainable mock for find().sort().skip().limit().populate()
    const makeQuery = (result) => ({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      then: (resolve, reject) => Promise.resolve(result).then(resolve).catch(reject),
    });

    LimitedOffer.find = jest.fn().mockReturnValue(makeQuery([]));
    LimitedOffer.countDocuments = jest.fn().mockResolvedValue(0);

    const req = { query: {} };
    const res = makeRes();

    await getLimitedOffers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, count: 0 }));
  });

  test('createLimitedOffer missing required fields returns 400', async () => {
    const req = { body: {} };
    const res = makeRes();

    await createLimitedOffer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('createLimitedOffer missing image returns 400 when fields present', async () => {
    const req = { body: { title: 'T', description: 'D', originalPrice: 100, offerPrice: 50, endDate: new Date(Date.now() + 86400000).toISOString() } };
    const res = makeRes();

    await createLimitedOffer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: expect.stringContaining('image') }));
  });

  test('getLimitedOffer returns 400 on invalid id (CastError)', async () => {
    // Mongoose's findById().populate(...) is chainable; mock accordingly to reject
    LimitedOffer.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockRejectedValue({ name: 'CastError' }) });

    const req = { params: { id: 'badid' } };
    const res = makeRes();

    await getLimitedOffer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Invalid offer ID' }));
  });
});
