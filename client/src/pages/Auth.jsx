import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { CheckCircle2, Circle, ArrowLeft, Home as HomeIcon, Eye, EyeOff } from "lucide-react";
import { useUser } from "../context/UserContext";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, register, verifyEmail, resendVerificationCode } = useUser();
  // Step states
  const [step, setStep] = useState(1); // 1 = login/register form, 2 = verification

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0); // Start at 0
  const [canResend, setCanResend] = useState(true); // Start as true
  const [expirationTime, setExpirationTime] = useState(null);
  const otpRefs = useRef([]);

  // Track if we need verification after login attempt
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Set sign up mode based on route
  useEffect(() => {
    // Priority: explicit navigation state (mode), then pathname
    if (location.state?.mode === "signin") setIsSignUp(false);
    else if (location.state?.mode === "signup") setIsSignUp(true);
    else setIsSignUp(location.pathname === "/create-account");
    // Reset to step 1 when toggling auth mode
    setStep(1);
    setPendingVerificationEmail("");
  }, [location.pathname]);

  // Countdown timer for verification code
  useEffect(() => {
    if (step !== 2) return;

    let timer;

    if (countdown > 0) {
      setCanResend(false);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]); // Add countdown to dependencies

  // OTP input handling
  const handleOtpInput = (e, index) => {
    if (e.target.value.length > 0 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...verificationCode];
    paste.forEach((char, index) => {
      if (otpRefs.current[index]) {
        otpRefs.current[index].value = char;
        newCode[index] = char;
      }
    });
    setVerificationCode(newCode);
  };

  // Step 1: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if all password validations pass
    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      toast.error("Please meet all password requirements");
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Registration result handled via UI toasts; removed debug log

      if (result.success) {
        if (result.requiresVerification) {
          // Save the email for verification
          setPendingVerificationEmail(result.email || formData.email);
          setStep(2);

          // Set countdown from backend response
          if (result.countdown !== undefined) {
            setCountdown(result.countdown);
            setCanResend(result.countdown <= 0);
          } else if (result.verificationCodeExpires) {
            // Calculate from expiration time
            const expires = new Date(result.verificationCodeExpires);
            const now = new Date();
            const secondsRemaining = Math.max(
              0,
              Math.floor((expires - now) / 1000)
            );
            setCountdown(secondsRemaining);
            setCanResend(secondsRemaining <= 0);
            setExpirationTime(expires);
          }

          // Check if this is a resend vs new registration
          if (result.message?.includes("resent")) {
            toast.info(
              "Account already exists but not verified. Verification code resent!"
            );
          } else {
            toast.success("Verification code sent to your email!");
          }
        } else {
          toast.success("Account created successfully!");
          navigate("/", { replace: true });
        }
      } else {
        // Handle "Email already exists and is verified" case
        if (result.message?.includes("already exists and is verified")) {
          toast.error("Email already registered. Please login instead.");
          setIsSignUp(false);
          setFormData({
            ...formData,
            name: "",
          });
        } else {
          toast.error(result.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Login - WITH VERIFICATION CHECK
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password, rememberMe);

      if (result.success) {
        toast.success("Signed in successfully!");
        navigate("/", { replace: true });
      } else {
        // Check if we need to verify email
        if (result.requiresVerification) {
          setPendingVerificationEmail(formData.email);
          setStep(2);
          toast.error("Please verify your email first");
          toast.info("If you didn't receive a code, click 'Resend Code'");
        } else {
          toast.error(result.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      await handleRegister(e);
    } else {
      await handleLogin(e);
    }
  };

  // Step 2: Verify Email
  const handleVerifyEmail = async () => {
    const code = verificationCode.join("");

    if (code.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    try {
      // Use the pending verification email or the form email
      const emailToVerify = pendingVerificationEmail || formData.email;
      const result = await verifyEmail(emailToVerify, code);

      if (result.success) {
        toast.success("Email verified successfully!");
        navigate("/", { replace: true });
      } else {
        toast.error(result.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend verification code
  const handleResendVerificationCode = async () => {
    setIsVerifying(true);
    try {
      const emailToResend = pendingVerificationEmail || formData.email;
      const result = await resendVerificationCode(emailToResend);

      if (result.success) {
        toast.success("New verification code sent!");
        setVerificationCode(["", "", "", "", "", ""]);

        // Update countdown from backend response
        if (result.countdown !== undefined) {
          setCountdown(result.countdown);
          setCanResend(result.countdown <= 0);
        } else if (result.verificationCodeExpires) {
          const expires = new Date(result.verificationCodeExpires);
          const now = new Date();
          const secondsRemaining = Math.max(
            0,
            Math.floor((expires - now) / 1000)
          );
          setCountdown(secondsRemaining);
          setCanResend(secondsRemaining <= 0);
          setExpirationTime(expires);
        }

        // Clear OTP inputs
        otpRefs.current.forEach((ref) => {
          if (ref) ref.value = "";
        });
      } else {
        toast.error(result.message || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Go back to registration form
  const handleBackToAuth = () => {
    setStep(1);
    setVerificationCode(["", "", "", "", "", ""]);
    setPendingVerificationEmail("");
    setCountdown(0); // Reset timer
    setCanResend(true); // Allow resend

    // Clear all OTP inputs
    otpRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });
  };

  const handlePasswordChange = (password) => {
    setFormData({ ...formData, password });

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

    if (name === "password") {
      handlePasswordChange(value);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setStep(1); // Reset to step 1
    setPendingVerificationEmail("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setPasswordValidation({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
  };

  const validationRules = [
    { key: "minLength", text: "At least 8 characters" },
    { key: "hasUpperCase", text: "One uppercase letter" },
    { key: "hasLowerCase", text: "One lowercase letter" },
    { key: "hasNumber", text: "One number" },
    { key: "hasSpecialChar", text: "One special character (!@#$% etc.)" },
  ];

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div >
      <div className="container py-16">
        {/* Back home button placed left of the auth card (outside the form) */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary hover:underline"
            type="button"
          >
            <HomeIcon className="w-4 h-4" />
            Back home
          </button>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 card-shadow">

            {/* Back button for verification step */}
            {step === 2 && (
              <button
                onClick={handleBackToAuth}
                className="flex items-center gap-2 text-primary hover:underline mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {pendingVerificationEmail ? "Login" : "Registration"}
              </button>
            )}

            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold mb-2">
                {step === 2
                  ? "Verify Your Email"
                  : isSignUp
                  ? "Create Account"
                  : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground">
                {step === 2
                  ? `Enter the 6-digit code sent to your email ${
                      pendingVerificationEmail || formData.email
                    }`
                  : isSignUp
                  ? "Sign up to get started"
                  : "Sign in to your account"}
              </p>
            </div>

            {/* Step 1: Registration/Login Form */}
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={isSignUp}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required={isSignUp}
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </div>
                      {formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && (
                          <p className="text-xs text-destructive mt-1">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                  </>
                )}

                {!isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={isLoading}
                        />
                        <span className="text-muted-foreground">
                          Remember me
                        </span>
                      </label>
                      <Link
                        to="/reset-password"
                        className="text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
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
                      Processing...
                    </span>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Verification Form */}
            {step === 2 && (
              <div className="space-y-6">
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
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={verificationCode[index]}
                        onChange={(e) => {
                          const newCode = [...verificationCode];
                          newCode[index] = e.target.value;
                          setVerificationCode(newCode);
                          handleOtpInput(e, index);
                        }}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-12 text-center text-xl font-semibold"
                        disabled={isVerifying}
                      />
                    ))}
                </div>

                {/* Timer */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Code expires in:{" "}
                    <span className="font-semibold">
                      {Math.floor(countdown / 60)
                        .toString()
                        .padStart(2, "0")}
                      :{(countdown % 60).toString().padStart(2, "0")}
                    </span>
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleVerifyEmail}
                    className="w-full"
                    size="lg"
                    disabled={
                      isVerifying || verificationCode.join("").length !== 6
                    }
                  >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                  </Button>

                  <Button
                    onClick={handleResendVerificationCode}
                    variant="outline"
                    className="w-full"
                    disabled={isVerifying || !canResend}
                  >
                    {canResend
                      ? "Resend Code"
                      : `Resend available in ${Math.floor(countdown / 60)}:${(
                          countdown % 60
                        )
                          .toString()
                          .padStart(2, "0")}`}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Can't find the email? Check your spam folder.
                </p>
              </div>
            )}

            {/* Only show auth toggle in step 1 */}
            {step === 1 && (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {isSignUp
                    ? "Already have an account? "
                    : "Don't have an account? "}
                </span>
                <button
                  onClick={() => {
                    toggleAuthMode();
                    window.scrollTo(0, 0);
                  }}
                  className="text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            )}

            {/* Social buttons only in step 1 */}
            {step === 1 && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" disabled={isLoading}>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button" disabled={isLoading}>
                    <svg
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="url(#instagram-gradient)"
                    >
                      <defs>
                        <linearGradient
                          id="instagram-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#f9ce34" />
                          <stop offset="50%" stopColor="#ee2a7b" />
                          <stop offset="100%" stopColor="#6228d7" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
