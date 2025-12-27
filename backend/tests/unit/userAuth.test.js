import { jest } from '@jest/globals';
import { userAuth } from '../../middleware/userAuth.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Auth Middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 401 when no token in request', async () => {
    const req = { cookies: {} };
    const res = makeRes();
    const next = jest.fn();

    await userAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when token is invalid', async () => {
    const req = { cookies: { token: 'invalid.token.here' } };
    const res = makeRes();
    const next = jest.fn();

    await userAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
