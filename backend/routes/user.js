import express from "express";
import {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationCode,
  sendResetOtp,
  verifyResetOtp,
  resendResetOtp,
  resetPassword,
} from "../controllers/UserController.js";
import { otpAttemptsMiddleware } from "../middleware/otpAttemptsMiddleware.js";
import userAuth from "../middleware/userAuth.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/verify-email", verifyEmail);
UserRouter.post("/resend-verification", resendVerificationCode);
UserRouter.post("/login", loginUser);
UserRouter.get("/me", userAuth, getCurrentUser);
UserRouter.post("/logout", userAuth, logoutUser);
UserRouter.post("/forgot-password", sendResetOtp);
UserRouter.post("/verify-reset-otp",otpAttemptsMiddleware, verifyResetOtp);
UserRouter.post("/resend-reset-otp",otpAttemptsMiddleware, resendResetOtp);
UserRouter.post("/reset-password",otpAttemptsMiddleware, resetPassword);

export default UserRouter;
