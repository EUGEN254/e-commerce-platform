// src/pages/users/UserEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUserEdit, 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaLock,
  FaCheck,
  FaTimes,
  FaKey,
  FaInfoCircle,
  FaCalendar,
  FaHistory,
  FaShieldAlt,
  FaSave,
  FaTrash,
  FaSync,
  FaBan,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import * as userService from '../../services/userService';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isVerified: false,
    verificationCode: '',
    verificationAttempts: 0
  });
  
  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  // Activity logs
  const [activityLogs, setActivityLogs] = useState([]);
  
  // Form errors
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Load user data
  useEffect(() => {
    loadUserData();
    loadActivityLogs();
  }, [id]);

  // Load user data from backend
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const res = await userService.getUserById(id);
      const fetched = res.data?.data || res.data;
      if (!fetched) {
        setErrors({ load: 'User not found' });
        setUser(null);
      } else {
        setUser(fetched);
        setFormData({
          name: fetched.name || '',
          email: fetched.email || '',
          isVerified: !!fetched.isVerified,
          verificationCode: fetched.verificationCode || '',
          verificationAttempts: fetched.verificationAttempts || 0
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to load user data';
      setErrors({ load: msg });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load activity logs
  const loadActivityLogs = async () => {
    // Mock activity logs
    const mockLogs = [
      { id: 1, action: 'User Created', timestamp: '2024-01-10T10:30:00Z', details: 'Account created via admin panel' },
      { id: 2, action: 'Email Verified', timestamp: '2024-01-10T11:15:00Z', details: 'Email verification completed' },
      { id: 3, action: 'Profile Updated', timestamp: '2024-01-12T14:20:00Z', details: 'Updated name and email' },
      { id: 4, action: 'Password Reset', timestamp: '2024-01-13T09:45:00Z', details: 'Password reset requested' },
      { id: 5, action: 'Login Success', timestamp: '2024-01-15T08:30:00Z', details: 'Successful login from IP: 192.168.1.1' },
    ];
    
    setActivityLogs(mockLogs);
  };

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
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
    
    // Check if passwords match
    if (name === 'confirmPassword' || name === 'newPassword') {
      if (passwordData.newPassword && passwordData.confirmPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password reset
  const validatePasswordReset = () => {
    const newErrors = {};
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Handle save user
  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        isVerified: !!formData.isVerified,
        verificationCode: formData.isVerified ? null : formData.verificationCode,
        verificationAttempts: formData.verificationAttempts || 0
      };

      const res = await userService.updateUser(id, payload);
      const updated = res.data?.data || res.data;

      setSuccessMessage(res.data?.message || 'User updated successfully!');
      setUser(updated || { ...user, ...payload });
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error updating user:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update user. Please try again.';
      setErrors({ submit: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!validatePasswordReset()) return;

    setIsSaving(true);
    try {
      // Update password via admin API
      await userService.updateUser(id, { password: passwordData.newPassword });

      const newLog = {
        id: activityLogs.length + 1,
        action: 'Password Reset by Admin',
        timestamp: new Date().toISOString(),
        details: 'Password was reset by administrator'
      };

      setActivityLogs(prev => [newLog, ...prev]);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordReset(false);

      setSuccessMessage('Password reset successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to reset password. Please try again.';
      setErrors({ submit: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle resend verification
  const handleResendVerification = async () => {
    setIsSaving(true);
    try {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      await userService.updateUser(id, { verificationCode: newCode, verificationAttempts: (formData.verificationAttempts || 0) + 1, isVerified: false });

      setFormData(prev => ({
        ...prev,
        verificationCode: newCode,
        verificationAttempts: (prev.verificationAttempts || 0) + 1,
        isVerified: false
      }));

      const newLog = {
        id: activityLogs.length + 1,
        action: 'Verification Code Sent',
        timestamp: new Date().toISOString(),
        details: `New verification code sent: ${newCode}`
      };

      setActivityLogs(prev => [newLog, ...prev]);
      setSuccessMessage('Verification code sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error sending verification:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to send verification code.';
      setErrors({ submit: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Deleting user:', id);
      navigate('/users');
      
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrors({ submit: 'Failed to delete user.' });
      setIsSaving(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate password strength score
  const passwordScore = Object.values(passwordStrength).filter(Boolean).length;
  const passwordStrengthColor = 
    passwordScore === 5 ? 'bg-green-500' :
    passwordScore === 4 ? 'bg-green-400' :
    passwordScore === 3 ? 'bg-yellow-500' :
    passwordScore === 2 ? 'bg-orange-500' : 'bg-red-500';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/users')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Users
        </button>
      </div>
    );
  }

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
              <h2 className="text-2xl font-bold">Edit User</h2>
            </div>
            <p className="text-blue-100">Manage user details and settings</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm text-blue-100">User ID</p>
                <p className="font-mono text-sm">{user._id}</p>
              </div>
              <FaUserEdit className="text-3xl opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Success & Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaCheck className="text-green-600" />
            <div>
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaTimes className="text-red-600" />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info & Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-600 text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name || 'Unnamed User'}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? (
                      <>
                        <FaCheckCircle />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle />
                        <span>Unverified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Verification Attempts</p>
                <p className="text-2xl font-bold text-gray-800">{user.verificationAttempts}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(user.createdAt)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(user.updatedAt)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-sm font-medium ${
                  user.isVerified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {user.isVerified ? 'Active' : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <FaUserEdit className="text-blue-500" />
              <span>Edit User Information</span>
            </h3>
            
            <form onSubmit={handleSaveUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
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
                      placeholder="Enter full name"
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

              {/* Verification Settings */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Verification Settings</h4>
                <div className="space-y-4">
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

                  {!formData.isVerified && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-1">
                          <FaKey className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            name="verificationCode"
                            value={formData.verificationCode}
                            onChange={handleChange}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter verification code"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={isSaving}
                          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          <FaSync className={isSaving ? 'animate-spin' : ''} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/users')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaShieldAlt className="text-blue-500" />
              <span>Security Actions</span>
            </h4>
            
            <div className="space-y-3">
              {/* Password Reset */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordReset(!showPasswordReset)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Reset Password</p>
                      <p className="text-sm text-gray-600">Set a new password for user</p>
                    </div>
                    <FaKey className="text-gray-400" />
                  </div>
                </button>

                {showPasswordReset && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                      {passwordData.newPassword && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${passwordStrengthColor} transition-all duration-300`}
                              style={{ width: `${(passwordScore / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <button
                      onClick={handlePasswordReset}
                      disabled={isSaving}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                )}

                {/* Delete User */}
                <button
                  onClick={handleDeleteUser}
                  disabled={isSaving}
                  className="w-full text-left p-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-700">Delete User</p>
                      <p className="text-sm text-red-600">Permanently remove this user</p>
                    </div>
                    <FaTrash className="text-red-500" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FaHistory className="text-blue-500" />
              <span>Recent Activity</span>
            </h4>
            
            <div className="space-y-4">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <FaCalendar className="text-xs" />
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {activityLogs.length > 5 && (
                <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2">
                  View All Activity
                </button>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Editing Notes</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Email changes require re-verification</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Password resets are logged in activity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Deleted users cannot be recovered</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;