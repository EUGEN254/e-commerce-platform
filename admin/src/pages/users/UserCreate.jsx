// src/pages/users/UserCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../services/userService';
import { 
  FaUserPlus, 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaLock,
  FaCheck,
  FaTimes,
  FaKey,
  FaInfoCircle,
  FaPaperPlane
} from 'react-icons/fa';

const UserCreate = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isVerified: false,
    sendVerificationEmail: true
  });
  
  // Form errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Check if passwords match
    if (name === 'confirmPassword' || name === 'password') {
      if (formData.password && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      }
    }
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  };

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setFormData(prev => ({ ...prev, password }));
    checkPasswordStrength(password);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const resp = await createUser(payload);
      const data = resp.data || resp;
      if (data.success) {
        setSuccessMessage(data.message || `User ${formData.email} created successfully!`);
        setTimeout(() => navigate('/users'), 1500);
      } else {
        setErrors({ submit: data.message || 'Failed to create user' });
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to create user. Please try again.';
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate password strength score
  const passwordScore = Object.values(passwordStrength).filter(Boolean).length;
  const passwordStrengthText = 
    passwordScore === 5 ? 'Very Strong' :
    passwordScore === 4 ? 'Strong' :
    passwordScore === 3 ? 'Good' :
    passwordScore === 2 ? 'Weak' : 'Very Weak';
  
  const passwordStrengthColor = 
    passwordScore === 5 ? 'bg-green-500' :
    passwordScore === 4 ? 'bg-green-400' :
    passwordScore === 3 ? 'bg-yellow-500' :
    passwordScore === 2 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => navigate('/users')}
                className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-2xl font-bold">Create New User</h2>
            </div>
            <p className="text-blue-100">Add a new user to the system</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <FaUserPlus className="text-3xl opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaCheck className="text-green-600" />
            <div>
              <p className="text-green-800 font-medium">{successMessage}</p>
              <p className="text-green-600 text-sm">Redirecting to users list...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaTimes className="text-red-600" />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <FaUser className="text-blue-500" />
                  <span>Basic Information</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name (Optional)
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="user@example.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <FaLock className="text-blue-500" />
                  <span>Security Settings</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password Field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <FaKey className="text-xs" />
                        <span>Generate</span>
                      </button>
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    
                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Password Strength:</span>
                          <span className={`text-sm font-medium ${
                            passwordScore >= 4 ? 'text-green-600' :
                            passwordScore >= 3 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {passwordStrengthText}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${passwordStrengthColor} transition-all duration-300`}
                            style={{ width: `${(passwordScore / 5) * 100}%` }}
                          ></div>
                        </div>
                        
                        {/* Password Requirements */}
                        <div className="mt-3 space-y-1">
                          {Object.entries(passwordStrength).map(([key, isValid]) => (
                            <div key={key} className="flex items-center space-x-2">
                              {isValid ? (
                                <FaCheck className="text-green-500 text-xs" />
                              ) : (
                                <FaTimes className="text-gray-300 text-xs" />
                              )}
                              <span className={`text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
                                {key === 'length' && 'At least 8 characters'}
                                {key === 'uppercase' && 'One uppercase letter'}
                                {key === 'lowercase' && 'One lowercase letter'}
                                {key === 'number' && 'One number'}
                                {key === 'special' && 'One special character'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                    {formData.password === formData.confirmPassword && formData.password && (
                      <p className="mt-1 text-sm text-green-600 flex items-center space-x-1">
                        <FaCheck />
                        <span>Passwords match</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <FaCheck className="text-blue-500" />
                  <span>Verification Settings</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Verified Status */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isVerified"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <label htmlFor="isVerified" className="font-medium text-gray-800">
                        Mark as Verified
                      </label>
                      <p className="text-sm text-gray-600">
                        User can login immediately without email verification
                      </p>
                    </div>
                  </div>

                  {/* Send Verification Email */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sendVerificationEmail"
                      name="sendVerificationEmail"
                      checked={formData.sendVerificationEmail}
                      onChange={handleChange}
                      disabled={formData.isVerified}
                      className={`w-5 h-5 text-blue-600 rounded focus:ring-blue-500 ${
                        formData.isVerified ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    <div>
                      <label htmlFor="sendVerificationEmail" className={`font-medium ${
                        formData.isVerified ? 'text-gray-500' : 'text-gray-800'
                      }`}>
                        Send Verification Email
                      </label>
                      <p className="text-sm text-gray-600">
                        {formData.isVerified 
                          ? 'Disabled for verified users'
                          : 'Send verification code to user\'s email'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/users')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <FaUserPlus />
                        <span>Create User</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Information & Tips */}
        <div className="space-y-6">
          {/* Information Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">About User Creation</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Email must be unique across the system</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Passwords are encrypted before storage</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Verification codes expire after 24 hours</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Users can reset their password via email</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4">User Statistics</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">1,245</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified Rate</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Creation Time</p>
                <p className="text-2xl font-bold text-blue-600">2.3 min</p>
              </div>
            </div>
          </div>

          {/* Template Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setFormData({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'Password123!',
                    confirmPassword: 'Password123!',
                    isVerified: true,
                    sendVerificationEmail: false
                  });
                  checkPasswordStrength('Password123!');
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-800">Load Sample User</p>
                <p className="text-sm text-gray-600">Prefill form with demo data</p>
              </button>
              
              <button
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    isVerified: false,
                    sendVerificationEmail: true
                  });
                  setErrors({});
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-800">Clear Form</p>
                <p className="text-sm text-gray-600">Reset all fields</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;