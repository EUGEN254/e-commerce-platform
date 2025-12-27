import { jest } from '@jest/globals';
import { getAllCategories, createCategory } from '../../controllers/categoriesController.js';
import Category from '../../models/Category.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Categories Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllCategories returns categories list', async () => {
    // create chainable mock query that resolves to array
    const makeQuery = (result) => {
      const q = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        then: (resolve, reject) => Promise.resolve(result).then(resolve).catch(reject),
      };
      return q;
    };

    Category.find = jest.fn().mockReturnValue(makeQuery([{ id: 'cat1' }]));

    const req = { query: {} };
    const res = makeRes();

    await getAllCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, count: 1 }));
  });

  test('createCategory missing fields returns 400', async () => {
    const req = { body: {} };
    const res = makeRes();

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
});
