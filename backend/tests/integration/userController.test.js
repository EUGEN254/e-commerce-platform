import { jest } from '@jest/globals';
import { registerUser, loginUser, getCurrentUser } from '../../controllers/UserController.js';
import User from '../../models/User.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn();
  res.clearCookie = jest.fn();
  return res;
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser missing fields returns 400', async () => {
    const req = { body: {} };
    const res = makeRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('registerUser creates new user when inputs valid', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue({ _doc: { name: 'Test', email: 't@example.com' } });

    const req = { body: { name: 'Test', email: 't@example.com', password: 'Aa123456!', confirmPassword: 'Aa123456!' } };
    const res = makeRes();

    await registerUser(req, res);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('loginUser missing credentials returns 400', async () => {
    const req = { body: {} };
    const res = makeRes();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('getCurrentUser returns 401 when no user', async () => {
    const req = { user: null };
    const res = makeRes();

    await getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
