// middleware/otpAttemptsMiddleware.js
import PasswordReset from "../models/PasswordReset.js";

const OTP_ATTEMPTS_LIMIT = 5;
const OTP_LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export const otpAttemptsMiddleware = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otpRecord = await PasswordReset.findOne({ email });

    if (!otpRecord) {
      return next();
    }

    // Check if locked
    if (otpRecord.lockUntil && otpRecord.lockUntil > new Date()) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please try again later.",
      });
    }

    // Reset if lockout expired
    if (otpRecord.lockUntil && otpRecord.lockUntil <= new Date()) {
      otpRecord.attempts = 0;
      otpRecord.lockUntil = null;
      await otpRecord.save();
    }

    // Check attempts limit
    if (otpRecord.attempts >= OTP_ATTEMPTS_LIMIT) {
      otpRecord.lockUntil = new Date(Date.now() + OTP_LOCKOUT_TIME);
      await otpRecord.save();

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please try again later.",
      });
    }

    req.otpRecord = otpRecord;
    next();
  } catch (error) {
    console.error("OTP attempts middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Keep these helpers as they are
export const incrementFailedAttempts = async (email) => {
  try {
    const otpRecord = await PasswordReset.findOne({ email });
    
    if (otpRecord) {
      otpRecord.attempts += 1;
      await otpRecord.save();
    }
  } catch (error) {
    console.error("Failed to increment OTP attempts:", error);
  }
};

export const resetAttempts = async (email) => {
  try {
    const otpRecord = await PasswordReset.findOne({ email });
    
    if (otpRecord) {
      otpRecord.attempts = 0;
      otpRecord.lockUntil = null;
      await otpRecord.save();
    }
  } catch (error) {
    console.error("Failed to reset OTP attempts:", error);
  }
};