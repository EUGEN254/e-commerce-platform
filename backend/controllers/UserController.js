import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import validatePassword from "../utils/validatePassword.js";
import {
  accountCreationEmail,
  sendOtpEmail,
  sendVerificationEmail,
} from "../utils/emailService.js";
import PasswordReset from "../models/PasswordReset.js";
import {
  incrementFailedAttempts,
  resetAttempts,
} from "../middleware/otpAttemptsMiddleware.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // check if all required fields are present
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all details",
      });
    }

    // check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // validate password requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet all requirements",
        validation: passwordValidation.validations,
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    // If user exists but is not verified, resend verification
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Generate new verification code
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

        // Update existing user with new verification code
        existingUser.verificationCode = verificationCode;
        existingUser.verificationCodeExpires = verificationCodeExpires;
        existingUser.verificationAttempts = 0;
        existingUser.name = name;
        existingUser.password = await bcrypt.hash(password, 10);
        await existingUser.save();

        // Send verification email
        await sendVerificationEmail(email, name, verificationCode);

        const {
          password: _,
          verificationCode: vc,
          ...userWithoutPassword
        } = existingUser._doc;

        // Calculate remaining seconds
        const now = new Date();
        const secondsRemaining = Math.max(
          0,
          Math.floor((verificationCodeExpires - now) / 1000)
        );

        return res.status(200).json({
          success: true,
          message: "Verification code resent to your email!",
          user: userWithoutPassword,
          requiresVerification: true,
          verificationCodeExpires: verificationCodeExpires,
          countdown: secondsRemaining,
        });
      } else {
        // User exists AND is verified
        return res.status(400).json({
          success: false,
          message: "Email already exists and is verified",
        });
      }
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    // create new user (not verified yet)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });

    // Send verification email
    await sendVerificationEmail(email, name, verificationCode);

    // Calculate remaining seconds
    const now = new Date();
    const secondsRemaining = Math.max(
      0,
      Math.floor((verificationCodeExpires - now) / 1000)
    );

    // Return response without setting cookie
    const {
      password: _,
      verificationCode: vc,
      ...userWithoutPassword
    } = user._doc;

    return res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for verification code.",
      user: userWithoutPassword,
      requiresVerification: true,
      verificationCodeExpires: verificationCodeExpires,
      countdown: secondsRemaining,
    });
  } catch (error) {
    console.error("Register Error", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verify email with code
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Check if verification code matches and is not expired
    if (user.verificationCode !== verificationCode) {
      // Increment verification attempts
      user.verificationAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
        attemptsLeft: 5 - user.verificationAttempts,
      });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    // Mark user as verified and clear verification code
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    user.verificationAttempts = 0;
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send welcome email
    await accountCreationEmail(user.name, user.email);

    const {
      password: _,
      verificationCode: vc,
      ...userWithoutPassword
    } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Verification Error", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    user.verificationAttempts = 0;
    await user.save();

    // Send new verification email
    await sendVerificationEmail(email, user.name, verificationCode);

    // Calculate remaining seconds
    const now = new Date();
    const secondsRemaining = Math.max(
      0,
      Math.floor((verificationCodeExpires - now) / 1000)
    );

    return res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
      verificationCodeExpires: verificationCodeExpires,
      countdown: secondsRemaining,
    });
  } catch (error) {
    console.error("Resend Verification Error", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find user - include isVerified in select
    const user = await User.findOne({ email }).select(
      "name email password isVerified"
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email first. Check your inbox for verification code.",
        requiresVerification: true,
        email: user.email,
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate token
    const token = generateToken(user, rememberMe);

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    };

    // Set appropriate maxAge based on rememberMe
    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days for "remember me"
    } else {
      cookieOptions.maxAge = 24 * 60 * 60 * 1000; // 1 day for normal session
    }

    // Set cookie with options
    res.cookie("token", token, cookieOptions);

    const { password: _, ...userWithoutPassword } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Signed in Successfully!",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login Error", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const safeUser = req.user;
    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error in getCurrentUser", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    // Clear the cookie with same options used when setting it
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send password reset OTP
const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists or not
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, you will receive a reset OTP",
      });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Clear old OTPs and save new one
    await PasswordReset.deleteMany({ email });
    await PasswordReset.create({ email, otp, expiresAt });

    // Send OTP email
    await sendOtpEmail(email, user.name, otp);

    res.status(200).json({
      success: true,
      message: "Reset OTP sent successfully to your email",
      expiresAt: expiresAt,
    });
  } catch (error) {
    console.error("sendResetOtp error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Verify password reset OTP
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await PasswordReset.findOne({ email, otp });
    if (!record) {
      // increment failed attempts
      await incrementFailedAttempts(email);
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    await resetAttempts(email);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("verifyResetOtp error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Resend reset OTP
const resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists or not
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, you will receive a reset OTP",
      });
    }

    // Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Clear old OTPs and save new one
    await PasswordReset.deleteMany({ email });
    await PasswordReset.create({ email, otp, expiresAt });

    // Send OTP email
    await sendOtpEmail(email, user.name, otp);

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
      expiresAt: expiresAt,
    });
  } catch (error) {
    console.error("resendResetOtp error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Reset password with verified OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await PasswordReset.findOne({ email, otp });
    if (!record) {
      await incrementFailedAttempts(email);
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet all requirements",
        validation: passwordValidation.validations,
      });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(403).json({
        success: false,
        message: "New password cannot be sam as old password",
      });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear used OTP
    await PasswordReset.deleteMany({ email });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const {
      password: _,
      verificationCode: vc,
      ...userWithoutPassword
    } = user._doc;

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  getCurrentUser,
  logoutUser,
  sendResetOtp,
  verifyResetOtp,
  resendResetOtp,
  resetPassword,
};
