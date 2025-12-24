// contexts/UserContext.jsx - FIXED VERSION
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "sonner";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Check if user is logged in AND verified on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/auth/me`, {
        withCredentials: true,
      });

      const userData = response.data.user;

      // CRITICAL FIX: Only set user if they are verified
      if (userData && userData.isVerified) {
        setUser(userData);
        fetchWishlist();
      } else {
        // User exists but not verified - log them out from frontend
        setUser(null);
        // Optionally clear session on backend too
        await axios.post(
          `${backendUrl}/api/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = useCallback(
  async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password, rememberMe },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        // Return the backend's response directly
        return {
          success: false,
          message: data.message,
          requiresVerification: data.requiresVerification || false,
          email: data.email
        };
      }
    } catch (error) {
      // Handle 403 error specifically
      if (error.response?.status === 403) {
        return {
          success: false,
          message: error.response.data.message,
          requiresVerification: error.response.data.requiresVerification || false,
          email: error.response.data.email
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        requiresVerification: false,
      };
    }
  },
  [backendUrl]
);

  const register = useCallback(
  async (userData) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        userData,
        { withCredentials: true }
      );

      const data = response.data;

      return {
        success: data.success,
        requiresVerification: data.requiresVerification || false,
        message: data.message,
        email: data.email || userData.email,
        verificationCodeExpires: data.verificationCodeExpires, 
        countdown: data.countdown, 
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        requiresVerification: false,
      };
    }
  },
  [backendUrl]
);
  const verifyEmail = useCallback(
    async (email, verificationCode) => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/auth/verify-email`,
          { email, verificationCode },
          { withCredentials: true }
        );

        const data = response.data;

        if (data.success && data.user && data.user.isVerified) {
          // NOW we can set the user
          setUser(data.user);
          return {
            success: true,
            message: data.message || "Email verified successfully!",
            user: data.user,
          };
        } else {
          return {
            success: false,
            message: "Verification failed - user not verified",
          };
        }
      } catch (error) {
        console.error("Verification error:", error);
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "An error occurred during verification",
        };
      }
    },
    [backendUrl]
  );

  const resendVerificationCode = useCallback(
  async (email) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/resend-verification`,
        { email },
        { withCredentials: true }
      );

      const data = response.data;

      return {
        success: data.success,
        message: data.message || "Failed to resend verification code",
        verificationCodeExpires: data.verificationCodeExpires, // ADD THIS
        countdown: data.countdown, // ADD THIS
      };
    } catch (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      };
    }
  },
  [backendUrl]
);

  const logout = useCallback(async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  }, [backendUrl]);

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/wishlist`, {
        withCredentials: true,
      });
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [backendUrl]);

  const toggleWishlist = useCallback(
    async (productId) => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/wishlist/toggle`,
          { productId },
          { withCredentials: true }
        );
        setWishlist(response.data.data || []);
        return { success: true, inWishlist: response.data.inWishlist };
      } catch (error) {
        console.error("Error toggling wishlist:", error);
        return { success: false };
      }
    },
    [backendUrl]
  );

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        wishlist,
        login,
        register,
        verifyEmail,
        resendVerificationCode,
        logout,
        backendUrl,
        toggleWishlist,
        checkAuth,
        isAuthenticated: !!user && user.isVerified,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
