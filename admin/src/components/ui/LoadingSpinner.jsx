import React from "react";
import { FaSpinner } from "react-icons/fa";

/**
 * Standardized Loading Spinner Component
 * Used across entire admin dashboard for consistent UX
 * 
 * @param {string} size - Size of spinner: 'sm' | 'md' | 'lg' (default: 'lg')
 * @param {string} message - Optional loading message to display below spinner
 * @param {string} className - Additional CSS classes to apply to container
 */
const LoadingSpinner = ({
  size = "lg",
  message = null,
  className = "",
}) => {
  // Size configurations
  const sizeClasses = {
    sm: "text-2xl py-4",
    md: "text-3xl py-8",
    lg: "text-4xl py-12",
  };

  return (
    <div
      className={`flex flex-col justify-center items-center ${sizeClasses[size]} ${className}`}
    >
      <FaSpinner className="animate-spin text-blue-500" />
      {message && (
        <p className="mt-3 text-gray-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
