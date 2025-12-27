import { jest } from '@jest/globals';
import { 
  verifyEmail, 
  loginUser, 
  sendResetOtp, 
  verifyResetOtp 
} from '../../controllers/UserController.js';
import User from '../../models/User.js';
import PasswordReset from '../../models/PasswordReset.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller - Additional Coverage', () => {
  beforeEach(() => jest.clearAllMocks());

  test('verifyEmail with missing fields returns 400', async () => {
    const req = { body: {} };
    const res = makeRes();

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('verifyEmail with non-existent user returns 404', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const req = { body: { email: 'a@x.com', verificationCode: '123456' } };
    const res = makeRes();

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('loginUser with invalid credentials returns 400', async () => {
    User.findOne = jest.fn().mockReturnValue({ 
      select: jest.fn().mockResolvedValue(null) 
    });

    const req = { body: { email: 'a@x.com', password: 'wrong' } };
    const res = makeRes();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('sendResetOtp with non-existent email returns 200 (security)', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const req = { body: { email: 'nonexistent@x.com' } };
    const res = makeRes();

    await sendResetOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('verifyResetOtp with invalid otp increments attempts', async () => {
    PasswordReset.findOne = jest.fn().mockResolvedValue(null);

    const req = { body: { email: 'a@x.com', otp: '000000' } };
    const res = makeRes();

    await verifyResetOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
