// ProtectedRoute.jsx - SIMPLIFIED VERSION
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If auth is required but no user, redirect to home
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in and trying to access auth pages, redirect to home
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;