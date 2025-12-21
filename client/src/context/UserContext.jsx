// contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/auth/me`, {
        withCredentials: true
      });
      setUser(response.data.user);
      
      // Fetch wishlist if user is logged in
      if (response.data.user) {
        fetchWishlist();
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      fetchWishlist();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  }, [backendUrl]);

  const register = useCallback(async (userData) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        userData,
        { withCredentials: true }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  }, [backendUrl]);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setWishlist([]);
    }
  }, [backendUrl]);

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/wishlist`, {
        withCredentials: true
      });
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [backendUrl]);

  const toggleWishlist = useCallback(async (productId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist/toggle`,
        { productId },
        { withCredentials: true }
      );
      setWishlist(response.data.data || []);
      return { success: true, inWishlist: response.data.inWishlist };
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { success: false };
    }
  }, [backendUrl]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        wishlist,
        login,
        register,
        logout,
        toggleWishlist,
        checkAuth,
        isAuthenticated: !!user
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}