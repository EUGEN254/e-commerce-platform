/**
 * Comprehensive error handling utility for the admin panel
 * Standardizes error extraction and formatting across the application
 */

/**
 * Extract error message from various error formats
 * Handles: axios errors, custom error objects, strings, etc.
 * 
 * @param {any} error - The error object from any source
 * @returns {string} - Formatted error message
 */
export const getErrorMessage = (error) => {
  // Axios error response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error with data object
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Custom error object with message field
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return 'An unexpected error occurred';
};

/**
 * Extract error status code
 * @param {any} error - The error object
 * @returns {number|null} - HTTP status code or null
 */
export const getErrorStatus = (error) => {
  return error?.response?.status || null;
};

/**
 * Check if error is due to network issues
 * @param {any} error - The error object
 * @returns {boolean} - True if network error
 */
export const isNetworkError = (error) => {
  return (
    error?.message === 'Network Error' ||
    error?.code === 'ERR_NETWORK' ||
    error?.request && !error?.response
  );
};

/**
 * Check if error is due to authentication/authorization
 * @param {any} error - The error object
 * @returns {boolean} - True if auth error
 */
export const isAuthError = (error) => {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
};

/**
 * Check if error is validation error
 * @param {any} error - The error object
 * @returns {boolean} - True if validation error
 */
export const isValidationError = (error) => {
  const status = getErrorStatus(error);
  return status === 400 || error?.response?.data?.validationErrors;
};

/**
 * Extract validation errors if present
 * @param {any} error - The error object
 * @returns {object} - Object with field: error pairs, or null
 */
export const getValidationErrors = (error) => {
  return error?.response?.data?.validationErrors || null;
};

/**
 * Format error for user display
 * Provides user-friendly messages instead of technical details
 * 
 * @param {any} error - The error object
 * @returns {object} - Formatted error with message, type, and action
 */
export const formatErrorForDisplay = (error) => {
  const message = getErrorMessage(error);
  const status = getErrorStatus(error);

  if (isNetworkError(error)) {
    return {
      message: 'Network connection error. Please check your internet connection.',
      type: 'network',
      action: 'retry'
    };
  }

  if (isAuthError(error)) {
    return {
      message: 'Your session has expired. Please log in again.',
      type: 'auth',
      action: 'redirect-to-login'
    };
  }

  if (isValidationError(error)) {
    const validationErrors = getValidationErrors(error);
    return {
      message: message || 'Please check your input and try again.',
      type: 'validation',
      action: 'show-form-errors',
      errors: validationErrors
    };
  }

  if (status === 404) {
    return {
      message: 'The requested resource was not found.',
      type: 'not-found',
      action: 'go-back'
    };
  }

  if (status === 409) {
    return {
      message: 'This resource already exists or is in conflict.',
      type: 'conflict',
      action: 'refresh'
    };
  }

  if (status >= 500) {
    return {
      message: 'Server error. Please try again later.',
      type: 'server',
      action: 'retry'
    };
  }

  return {
    message: message || 'An error occurred. Please try again.',
    type: 'general',
    action: 'retry'
  };
};

/**
 * Check if error response contains specific error code
 * @param {any} error - The error object
 * @param {string} code - Error code to check for
 * @returns {boolean} - True if error has the specified code
 */
export const hasErrorCode = (error, code) => {
  return error?.response?.data?.code === code ||
         error?.code === code;
};

/**
 * Get HTTP status text for a status code
 * @param {number} status - HTTP status code
 * @returns {string} - Status text
 */
export const getStatusText = (status) => {
  const statusTexts = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  
  return statusTexts[status] || 'Unknown Error';
};

/**
 * Log error in development mode
 * @param {string} context - Context/location of error
 * @param {any} error - The error object
 */
export const logError = (context, error) => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, {
      message: getErrorMessage(error),
      status: getErrorStatus(error),
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.response?.data
    });
  }
};

/**
 * Safe async handler wrapper for try-catch blocks
 * Ensures consistent error formatting
 * 
 * Usage:
 * const handleDelete = safeAsync(async (id) => {
 *   await deleteProduct(id);
 *   toast.success('Deleted!');
 * }, 'Delete Product');
 * 
 * @param {function} asyncFn - Async function to wrap
 * @param {string} context - Context for logging
 * @returns {function} - Wrapped function that handles errors
 */
export const safeAsync = (asyncFn, context = 'Operation') => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      logError(context, error);
      throw error; // Re-throw to be handled by caller
    }
  };
};

export default {
  getErrorMessage,
  getErrorStatus,
  isNetworkError,
  isAuthError,
  isValidationError,
  getValidationErrors,
  formatErrorForDisplay,
  hasErrorCode,
  getStatusText,
  logError,
  safeAsync
};
