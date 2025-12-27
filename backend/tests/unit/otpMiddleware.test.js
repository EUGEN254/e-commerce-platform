import { jest } from '@jest/globals';
import { otpAttemptsMiddleware, incrementFailedAttempts, resetAttempts } from '../../middleware/otpAttemptsMiddleware.js';
import PasswordReset from '../../models/PasswordReset.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('OTP Attempts Middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 400 when email missing', async () => {
    const req = { body: {} };
    const res = makeRes();
    const next = jest.fn();

    await otpAttemptsMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next when no record exists', async () => {
    PasswordReset.findOne = jest.fn().mockResolvedValue(null);
    const req = { body: { email: 'a@x.com' } };
    const res = makeRes();
    const next = jest.fn();

    await otpAttemptsMiddleware(req, res, next);

    expect(PasswordReset.findOne).toHaveBeenCalledWith({ email: 'a@x.com' });
    expect(next).toHaveBeenCalled();
  });

  test('returns 429 when locked until future', async () => {
    const future = new Date(Date.now() + 10000);
    PasswordReset.findOne = jest.fn().mockResolvedValue({ lockUntil: future });
    const req = { body: { email: 'a@x.com' } };
    const res = makeRes();
    const next = jest.fn();

    await otpAttemptsMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });

  test('locks when attempts exceeded', async () => {
    const save = jest.fn().mockResolvedValue(true);
    PasswordReset.findOne = jest.fn().mockResolvedValue({ attempts: 5, lockUntil: null, save });

    const req = { body: { email: 'a@x.com' } };
    const res = makeRes();
    const next = jest.fn();

    await otpAttemptsMiddleware(req, res, next);

    expect(save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });

  test('incrementFailedAttempts increments and saves', async () => {
    const save = jest.fn().mockResolvedValue(true);
    PasswordReset.findOne = jest.fn().mockResolvedValue({ attempts: 1, save });

    await incrementFailedAttempts('a@x.com');
    expect(save).toHaveBeenCalled();
  });

  test('resetAttempts resets and saves', async () => {
    const save = jest.fn().mockResolvedValue(true);
    PasswordReset.findOne = jest.fn().mockResolvedValue({ attempts: 2, lockUntil: new Date(), save });

    await resetAttempts('a@x.com');
    expect(save).toHaveBeenCalled();
  });
});
