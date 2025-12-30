import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import validatePassword from '../../utils/validatePassword.js';
import { sendVerificationEmail } from '../../utils/emailService.js';
import logger from '../../utils/logger.js';
import PasswordReset from '../../models/PasswordReset.js';
import Transaction from '../../models/Transaction.js';
import Order from '../../models/Order.js';

// POST /api/admin/users - Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, isVerified, sendVerificationEmail: sendEmail } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Validate password requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet all requirements',
        validation: passwordValidation.validations,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code if not verified
    let verificationCode = null;
    let verificationCodeExpires = null;

    if (!isVerified) {
      verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    }

    // Create new user
    const user = await User.create({
      name: name || '',
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
      isVerified: isVerified || false,
    });

    // Send verification email if requested and not verified
    if (sendEmail && !isVerified) {
      try {
        await sendVerificationEmail(email, name || email, verificationCode);
      } catch (emailError) {
        logger.error('Failed to send verification email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationCode;

    return res.status(201).json({
      success: true,
      message: `User created successfully${sendEmail && !isVerified ? '. Verification email sent.' : '.'}`,
      data: userResponse,
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const search = req.query.search ? req.query.search.trim() : null;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Optionally filter by verification status
    if (req.query.isVerified === 'true') filter.isVerified = true;
    if (req.query.isVerified === 'false') filter.isVerified = false;

    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        next: skip + limit < total ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// PATCH /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const updates = req.body || {};

    // If password is being updated by admin, hash it before saving
    if (updates.password) {
      const passwordValidation = validatePassword(updates.password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ success: false, message: 'Password does not meet requirements', validation: passwordValidation.validations });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ success: true, data: user, message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/admin/users/:id/activity
export const getUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const email = user.email;

    // Fetch recent password reset attempts
    const resets = await PasswordReset.find({ email }).sort('-createdAt').limit(10).lean();
    const resetEvents = resets.map(r => ({
      type: 'password_reset',
      action: 'Password Reset Request',
      timestamp: r.createdAt || r.expiresAt || new Date(),
      details: `OTP created (masked): ${r.otp ? r.otp.replace(/.(?=.{2})/g, '*') : 'N/A'}`
    }));

    // Fetch recent transactions
    const transactions = await Transaction.find({ userId: user._id }).sort('-createdAt').limit(10).lean();
    const transactionEvents = transactions.map(t => ({
      type: 'transaction',
      action: `Transaction ${t.status}`,
      timestamp: t.createdAt || t.paidAt || new Date(),
      details: `Reference: ${t.reference}, Amount: ${t.amountPaid || t.amount} ${t.currency}`
    }));

    // Fetch recent orders
    const orders = await Order.find({ userId: user._id }).sort('-createdAt').limit(10).lean();
    const orderEvents = orders.map(o => ({
      type: 'order',
      action: `Order ${o.status}`,
      timestamp: o.createdAt || new Date(),
      details: `Order#: ${o.orderNumber}, Total: ${o.totalAmount} ${o.currency}`
    }));

    // Merge and sort by timestamp
    const events = [...resetEvents, ...transactionEvents, ...orderEvents].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({ success: true, data: events.slice(0, 20) });
  } catch (error) {
    logger.error('Error fetching user activity:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
