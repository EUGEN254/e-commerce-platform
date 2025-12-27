import { jest } from '@jest/globals';
import { 
  getAllCategories,
  getCategoriesByType
} from '../../controllers/categoriesController.js';
import Category from '../../models/Category.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Categories Controller - Additional Coverage', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getAllCategories with type filter', async () => {
    const makeQuery = (result) => ({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: (resolve, reject) => Promise.resolve(result).then(resolve).catch(reject),
    });

    Category.find = jest.fn().mockReturnValue(makeQuery([{ id: 'cat1', type: 'main' }]));

    const req = { query: { type: 'main' } };
    const res = makeRes();

    await getAllCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('getCategoriesByType returns categories for type', async () => {
    Category.find = jest.fn().mockReturnValue({ 
      sort: jest.fn().mockResolvedValue([{ id: 'cat1', type: 'electronics' }])
    });

    const req = { params: { type: 'electronics' }, query: {} };
    const res = makeRes();

    await getCategoriesByType(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
