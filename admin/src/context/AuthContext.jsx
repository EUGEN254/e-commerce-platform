import { createContext, useContext, useState, useEffect } from "react";
import {
  loginAdminRequest,
  logoutAdminRequest,
  getAdminProfile,
} from "../services/authService.js";
import { setupGlobalErrorHandling } from "../utils/axiosInstance.js";
import { getErrorMessage } from "../utils/errorHandler.js";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup global error interceptor on mount
  useEffect(() => {
    setupGlobalErrorHandling(() => {
      // Callback when 401/403 error occurs
      handleAuthError();
    });
  }, []);

  // Handle authentication errors (401/403)
  const handleAuthError = () => {
    setAdmin(null);
    // Don't show toast here, let individual operations show their own error
    // Only clear the admin state to force re-login
  };

  // Auto-login on refresh
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminProfile();
        setAdmin(res.data.adminData);
      } catch (error) {
        // Silently fail - user is not logged in
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const res = await loginAdminRequest({ email, password, rememberMe });
      
      // Handle different response structures
      const adminData = res.data?.adminData || res.data?.data?.adminData || res.data?.admin;
      
      if (!adminData) {
        throw new Error('Invalid response format from server');
      }

      setAdmin(adminData);
      toast.success(res.data?.message || "Login successful!");
      
      return { 
        success: true, 
        message: res.data?.message || "Login successful!" 
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAdminRequest();
      setAdmin(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      // Still logout on error
      setAdmin(null);
      toast.error("Logout error: " + errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
