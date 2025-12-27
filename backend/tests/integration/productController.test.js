import { jest } from '@jest/globals';
import { getProducts, getProductById } from '../../controllers/productController.js';
import Product from '../../models/Product.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Product Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getProducts returns empty list when none found', async () => {
    // create chainable mock query that resolves to []
    const makeQuery = (result) => {
      const q = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: (resolve, reject) => Promise.resolve(result).then(resolve).catch(reject),
      };
      return q;
    };

    Product.find = jest.fn().mockReturnValue(makeQuery([]));
    Product.countDocuments = jest.fn().mockResolvedValue(0);

    const req = { query: {} };
    const res = makeRes();

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, count: 0 }));
  });

  test('getProductById returns 400 on invalid id (CastError)', async () => {
    Product.findById = jest.fn().mockRejectedValue({ name: 'CastError' });

    const req = { params: { id: 'badid' }, user: null };
    const res = makeRes();

    await getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Invalid product ID' }));
  });
});
