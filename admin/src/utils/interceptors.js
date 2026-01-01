/**
 * Global error interceptor for axios
 * Handles auth errors, network errors, and standardizes error format
 */

import { logError, isAuthError, isNetworkError } from './errorHandler.js';

/**
 * Setup global error interceptor
 * @param {object} axiosInstance - The axios instance to setup
 * @param {function} onAuthError - Callback when auth error occurs (e.g., logout)
 */
export const setupErrorInterceptor = (axiosInstance, onAuthError) => {
  axiosInstance.interceptors.response.use(
    // Success response
    (response) => response,
    
    // Error response
    (error) => {
      const context = `${error?.config?.method?.toUpperCase()} ${error?.config?.url}`;
      
      // Log the error for debugging
      logError(context, error);

      // Handle authentication errors
      if (isAuthError(error)) {
        // Call logout callback to handle auth error
        if (onAuthError && typeof onAuthError === 'function') {
          onAuthError();
        }
      }

      // Network errors are handled on the caller side
      // because they don't have response data to send to user

      // Return the error as-is for the calling code to handle
      // The calling code should use getErrorMessage() to extract user-friendly message
      return Promise.reject(error);
    }
  );
};

/**
 * Setup request interceptor to add auth tokens
 * @param {object} axiosInstance - The axios instance to setup
 * @param {function} getToken - Function to get current auth token
 */
export const setupRequestInterceptor = (axiosInstance, getToken) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken?.();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default {
  setupErrorInterceptor,
  setupRequestInterceptor
};
