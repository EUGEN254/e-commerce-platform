import { createContext, useContext, useState, useEffect } from "react";
import {
  loginAdminRequest,
  logoutAdminRequest,
  getAdminProfile,
} from "../services/authService.js";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login on refresh
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminProfile();
        setAdmin(res.data.adminData);
      } catch (error) {
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
      setAdmin(res.data.adminData);
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await logoutAdminRequest();
      setAdmin(null);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
