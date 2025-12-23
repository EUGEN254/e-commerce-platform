import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Home,
  Mail,
  Lock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import axios from "axios";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useUser } from "../context/UserContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { backendUrl, setUser } = useUser();
  const inputRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  
  // Separate loading states for each button
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const [expiresAt, setExpiredAt] = useState(null);
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [canResend, setCanResend] = useState(false);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [formData, setFormData] = useState({
    newPassword: "",
  });

  const validationRules = [
    { key: "minLength", text: "At least 8 characters" },
    { key: "hasUpperCase", text: "One uppercase letter" },
    { key: "hasLowerCase", text: "One lowercase letter" },
    { key: "hasNumber", text: "One number" },
    { key: "hasSpecialChar", text: "One special character (!@#$% etc.)" },
  ];

  // Countdown timer
  useEffect(() => {
    if (!isEmailSent) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEmailSent]);

  // Handle password change and validation
  const handlePasswordChange = (password) => {
    setFormData({ ...formData, newPassword: password });

    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      handlePasswordChange(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // OTP input handling
  const handleOtpInput = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    const newCode = [...otp];
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        newCode[index] = char;
      }
    });
    setOtp(newCode);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^[0-9]$/.test(value)) return; // Only allow numbers

    const newCode = [...otp];
    newCode[index] = value;
    setOtp(newCode);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Step 1 — Send OTP
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/forgot-password`,
        { email }
      );
      const data = response.data;

      if (data.success) {
        toast.success(data.message);

        setIsEmailSent(true);
        // using expired at from backend
        if (data.expiresAt) {
          setExpiredAt(new Date(data.expiresAt));
        } else {
          setExpiredAt(new Date(Date.now() + 15 * 60 * 1000));
        }
        setCanResend(false);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/verify-reset-otp`,
        {
          email,
          otp: enteredOtp,
        }
      );
      const data = response.data;

      if (data.success) {
        toast.success("OTP Verified");
        setIsOtpVerified(true);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        // Too many attempts - show message from backend
        toast.error(
          error.response?.data?.message ||
            "Too many attempts. Please try again later."
        );
      } else {
        // All other errors
        toast.error(error.response?.data?.message || "OTP verification failed");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 3 — Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check if all password validations pass
    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      toast.error("Please meet all password requirements");
      return;
    }

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please verify OTP first");
      return;
    }

    setIsResetting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp: enteredOtp,
          newPassword: formData.newPassword,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data.success) {
        toast.success(data.message);
        setUser(data.user);
        navigate("/", { replace: true });
      } else {
        toast.error(data.message || "Password reset failed");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        // Too many attempts
        toast.error(
          error.response?.data?.message ||
            "Too many attempts. Please try again later."
        );
      } else {
        // All other errors
        toast.error(error.response?.data?.message || "Reset failed");
      }
    } finally {
      setIsResetting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/resend-reset-otp`,
        { email }
      );
      const data = response.data;

      if (data.success) {
        toast.success("New OTP sent!");

        if (data.expiresAt) {
          setExpiredAt(new Date(data.expiresAt));
        } else {
          setExpiredAt(new Date(Date.now() + 15 * 60 * 1000));
        }

        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current.forEach((ref) => {
          if (ref) ref.value = "";
        });
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        // Too many attempts
        toast.error(
          error.response?.data?.message ||
            "Too many attempts. Please try again later."
        );
      } else {
        // All other errors
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      }
    } finally {
      setIsResending(false);
    }
  };

  // Replace the countdown calculation with this
  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const remainingMs = expiresAt.getTime() - now.getTime();

      if (remainingMs <= 0) {
        clearInterval(timer);
        setCountdown(0);
        setCanResend(true);
        return;
      }

      setCountdown(Math.floor(remainingMs / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, isEmailSent]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to login */}
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>
        </div>

        <div className="bg-card rounded-2xl p-8 card-shadow border border-border">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 text-foreground">
              Forgot Password
            </h1>
            <p className="text-muted-foreground">
              {isOtpVerified
                ? "Create a new secure password"
                : isEmailSent
                ? "Enter the 6-digit OTP sent to your email"
                : "Enter your registered email address"}
            </p>
          </div>

          {/* Step 1: Email */}
          {!isEmailSent && (
            <form onSubmit={handleSendEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSending}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSending}
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {isEmailSent && !isOtpVerified && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the 6-digit code sent to <br />
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>

              {/* OTP Inputs */}
              <div
                className="flex justify-center space-x-2 mb-6"
                onPaste={handleOtpPaste}
              >
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-12 text-center text-xl font-semibold"
                      disabled={isVerifying || isResending}
                    />
                  ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Code expires in:{" "}
                  <span className="font-semibold text-foreground">
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                  </span>
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full"
                  size="lg"
                  disabled={isVerifying || otp.join("").length !== 6}
                >
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button
                  onClick={handleResendOtp}
                  variant="outline"
                  className="w-full"
                  disabled={isResending || !canResend}
                >
                  {isResending ? (
                    "Resending..."
                  ) : canResend ? (
                    "Resend Code"
                  ) : (
                    `Resend available in ${minutes}:${seconds
                      .toString()
                      .padStart(2, "0")}`
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Can't find the email? Check your spam folder.
              </p>
            </div>
          )}

          {/* Step 3: New Password */}
          {isOtpVerified && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isResetting}
                    className="pl-10"
                  />
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Password must contain:
                  </p>
                  <ul className="space-y-1">
                    {validationRules.map((rule) => (
                      <li
                        key={rule.key}
                        className="flex items-center gap-2 text-xs"
                      >
                        {passwordValidation[rule.key] ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-gray-400" />
                        )}
                        <span
                          className={
                            passwordValidation[rule.key]
                              ? "text-green-600 font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {rule.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  isResetting ||
                  !Object.values(passwordValidation).every(Boolean)
                }
              >
                {isResetting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;