/**
 * Client-side error handling utility
 * Handles errors appropriately based on environment (dev vs production)
 */

const isDev = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

/**
 * Safe console logging - only logs in development
 * @param {string} level - 'log', 'error', 'warn', 'info'
 * @param {string} context - Context/location of the log
 * @param {any} data - Data to log
 */
const consoleLog = (level = 'log', context = '', data = '') => {
  if (!isDev) return; // Don't log in production
  
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}] [${context}]`;
  
  try {
    if (console[level]) {
      console[level](prefix, data);
    }
  } catch (e) {
    // Fail silently if console methods don't exist
  }
};

/**
 * Log error only in development
 * @param {string} context - Context/location of error
 * @param {Error|string} error - Error object or message
 */
export const logError = (context, error) => {
  if (isDev) {
    console.error(`[ERROR] [${context}]`, error);
  }
};

/**
 * Log warning only in development
 * @param {string} context - Context/location
 * @param {string} message - Warning message
 */
export const logWarning = (context, message) => {
  if (isDev) {
    console.warn(`[WARN] [${context}]`, message);
  }
};

/**
 * Log info only in development
 * @param {string} context - Context/location
 * @param {any} data - Info to log
 */
export const logInfo = (context, data) => {
  if (isDev) {
    console.info(`[INFO] [${context}]`, data);
  }
};

/**
 * Extract error message safely
 * @param {Error|any} error - Error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Get HTTP status code from error
 * @param {Error} error - Error object
 * @returns {number|null} - Status code or null
 */
export const getErrorStatus = (error) => {
  return error?.response?.status || null;
};

/**
 * Check if error is network-related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return (
    error?.message === 'Network Error' ||
    error?.code === 'ERR_NETWORK' ||
    (error?.request && !error?.response)
  );
};

/**
 * Check if error is auth-related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
};

/**
 * Format error for display to user
 * @param {Error} error - Error object
 * @returns {object} - Formatted error with message and type
 */
export const formatErrorForDisplay = (error) => {
  const message = getErrorMessage(error);
  const status = getErrorStatus(error);

  if (isNetworkError(error)) {
    return {
      message: 'Connection error. Please check your internet.',
      type: 'network',
    };
  }

  if (isAuthError(error)) {
    return {
      message: 'Please log in to continue.',
      type: 'auth',
    };
  }

  if (status === 404) {
    return {
      message: 'The item you are looking for was not found.',
      type: 'not-found',
    };
  }

  if (status >= 500) {
    return {
      message: 'Server error. Please try again later.',
      type: 'server',
    };
  }

  return {
    message: message || 'Something went wrong. Please try again.',
    type: 'general',
  };
};

/**
 * Safe async handler - handles errors silently in production
 * Logs errors only in development
 * 
 * @param {function} asyncFn - Async function to wrap
 * @param {string} context - Context for logging
 * @returns {function} - Wrapped function
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

/**
 * Handle API errors gracefully
 * Shows user-friendly message in production
 * Shows full details in development
 * 
 * @param {Error} error - Error from API
 * @param {function} onError - Callback for error handling (toast, etc)
 */
export const handleApiError = (error, onError) => {
  const formatted = formatErrorForDisplay(error);
  
  // Log details in development
  if (isDev) {
    console.error('[API Error]', {
      message: getErrorMessage(error),
      status: getErrorStatus(error),
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.response?.data,
    });
  }
  
  // Show user-friendly message
  if (onError && typeof onError === 'function') {
    onError(formatted.message);
  }
  
  return formatted;
};

/**
 * Suppress specific console methods globally (for production)
 * Use with caution - only in production build
 */
export const suppressConsoleLogs = () => {
  if (isProduction) {
    // Override console methods to do nothing
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    // Keep error for critical issues if needed, or remove this line to suppress all
    // console.error = () => {};
  }
};

/**
 * Create error boundary info (for React error boundaries)
 * @param {Error} error - Error from boundary
 * @param {object} errorInfo - Error info from boundary
 * @returns {object} - Formatted error info
 */
export const formatErrorBoundaryInfo = (error, errorInfo) => {
  return {
    message: error.toString(),
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
  };
};

export default {
  logError,
  logWarning,
  logInfo,
  getErrorMessage,
  getErrorStatus,
  isNetworkError,
  isAuthError,
  formatErrorForDisplay,
  safeAsync,
  handleApiError,
  suppressConsoleLogs,
  formatErrorBoundaryInfo,
  isDev,
  isProduction,
};
