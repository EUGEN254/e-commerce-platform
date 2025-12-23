import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Only set redirect after a brief delay to prevent flash
    if (!loading) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 50); // Small delay to prevent flash
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't redirect immediately - wait for the effect
  if (!shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in and trying to access auth pages, redirect to home
  if (user && !requireAuth) {
    return <Navigate to="/" replace />;
  }

  // If user is not logged in and trying to access protected pages, redirect to home
  if (!user && requireAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;