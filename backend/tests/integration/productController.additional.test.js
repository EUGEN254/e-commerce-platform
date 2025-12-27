import { jest } from '@jest/globals';
import { 
  getProducts, 
  searchProducts,
  getProductsByCategory
} from '../../controllers/productController.js';
import Product from '../../models/Product.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Product Controller - Additional Coverage', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getProducts with price range filter', async () => {
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

    Product.find = jest.fn().mockReturnValue(makeQuery([{ name: 'Item', price: 100 }]));
    Product.countDocuments = jest.fn().mockResolvedValue(1);

    const req = { query: { minPrice: '50', maxPrice: '150' } };
    const res = makeRes();

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('searchProducts with no query returns 400', async () => {
    const req = { query: {} };
    const res = makeRes();

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('getProductsByCategory returns paginated results', async () => {
    const makeQuery = (result) => {
      const q = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        then: (resolve, reject) => Promise.resolve(result).then(resolve).catch(reject),
      };
      return q;
    };

    Product.find = jest.fn().mockReturnValue(makeQuery([{ name: 'P1' }]));
    Product.countDocuments = jest.fn().mockResolvedValue(1);

    const req = { params: { category: 'electronics' }, query: {} };
    const res = makeRes();

    await getProductsByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
