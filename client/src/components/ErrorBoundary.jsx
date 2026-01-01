import React from 'react';
import { logError, formatErrorBoundaryInfo } from '../utils/errorHandler';

/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 * Logs errors only in development
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      isProduction: import.meta.env.PROD
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details in development only
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught error:', error);
      console.error('Error Info:', errorInfo);
    }
    
    // Store error info
    this.setState({
      error,
      errorInfo
    });

    // Log for monitoring (in production, you might send to error tracking service)
    logError('ErrorBoundary', error);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0 4v2M9 3h6M3 9h18M3 9v12a3 3 0 003 3h12a3 3 0 003-3V9"
                    />
                  </svg>
                </div>
              </div>

              {/* Error Message */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>

              <p className="text-gray-600 mb-6">
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>

              {/* Development Error Details */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 text-left bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto border border-gray-200">
                  <p className="text-sm font-mono text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={this.resetError}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
