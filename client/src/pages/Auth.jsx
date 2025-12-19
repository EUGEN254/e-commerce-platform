import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaCheckCircle,
  FaArrowLeft,
  FaInstagram,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(`${isLogin ? "Login" : "Signup"} data:`, formData);

      // For demo, redirect to home after successful auth
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Continue with ${provider}`);
    // Implement social login logic here
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Implement forgot password flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl lg:max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl">
          
          {/* Left Side - Hidden on mobile, visible on lg and above */}
          <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 lg:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Back to home */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>

              {/* Logo/Brand */}
              <div className="mb-8">
                <div className="text-2xl font-bold mb-2">
                  <span className="text-white">Shop</span>
                  <span className="text-purple-200">Hub</span>
                </div>
                <p className="text-indigo-100">Your premium shopping destination</p>
              </div>

              {/* Hero Content */}
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl lg:text-4xl font-bold mb-6">
                  {isLogin ? "Welcome Back!" : "Join Our Community"}
                </h1>
                <p className="text-sm text-indigo-100 mb-8">
                  {isLogin
                    ? "Sign in to access your personalized shopping experience, track orders, and save your favorites."
                    : "Create an account to unlock exclusive deals, faster checkout, and personalized recommendations."}
                </p>

                {/* Features List */}
                <div className="space-y-5">
                  {[
                    "Exclusive member discounts",
                    "Fast & secure checkout",
                    "Order tracking",
                    "Personalized recommendations",
                    "24/7 customer support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaCheckCircle className="w-4 h-4 text-green-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <p className="italic mb-4">
                    "ShopHub transformed my shopping experience! Fast delivery and amazing customer service."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20"></div>
                    <div>
                      <div className="font-semibold">Sarah Johnson</div>
                      <div className="text-sm text-indigo-200">Premium Member</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form (Full width on mobile) */}
          <div className="w-full lg:w-3/5 bg-white p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Mobile-only back button and brand */}
              <div className="lg:hidden mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
                <div className="text-center mb-6">
                  <div className="text-xl font-bold mb-1">
                    <span className="text-gray-800">Shop</span>
                    <span className="text-indigo-600">Hub</span>
                  </div>
                  <p className="text-sm text-gray-600">Your shopping destination</p>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? "Sign In to Your Account" : "Create New Account"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {isLogin
                    ? "Enter your credentials to access your account"
                    : "Fill in your details to get started"}
                </p>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-center text-sm lg:text-base">{errors.submit}</p>
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="mb-6 lg:mb-8">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleSocialLogin("google")}
                    className="p-2 sm:p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    <span className="text-xs sm:text-sm font-medium">Google</span>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("facebook")}
                    className="p-2 sm:p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("instagram")}
                    className="p-2 sm:p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                    <span className="text-xs sm:text-sm font-medium">Instagram</span>
                  </button>
                </div>
                <div className="flex items-center my-4 lg:my-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="px-3 lg:px-4 text-gray-500 text-xs sm:text-sm">Or continue with</div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Field (Sign Up only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                        <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm sm:text-base`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                      <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm sm:text-base`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                      <FaLock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm sm:text-base`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                        <FaLock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 border ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm sm:text-base`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Remember Me & Forgot Password (Login only) */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Terms & Conditions (Sign Up only) */}
                {!isLogin && (
                  <div className="text-xs sm:text-sm text-gray-600">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 sm:mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        required
                      />
                      <span>
                        I agree to the{" "}
                        <a href="/terms" className="text-indigo-600 hover:text-indigo-800">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-indigo-600 hover:text-indigo-800">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Switch Mode */}
              <div className="mt-6 lg:mt-8 text-center">
                <p className="text-sm sm:text-base text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={toggleMode}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>

              {/* Security Note */}
              <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1 text-sm sm:text-base">Secure & Protected</h4>
                    <p className="text-xs sm:text-sm text-green-700">
                      Your data is encrypted and protected. We never share your personal information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;