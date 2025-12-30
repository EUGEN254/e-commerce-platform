// ProtectedRoute.jsx - MINIMAL VERSION
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Only show placeholder if loading takes longer than 500ms
  useEffect(() => {
    if (!loading) {
      setShowPlaceholder(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowPlaceholder(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [loading]);

  if (requireAuth && !user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user && !loading) {
    return <Navigate to="/" replace />;
  }

  // If still loading and placeholder should show, preserve layout
  if (loading && showPlaceholder) {
    return <div className="flex-1" aria-hidden />;
  }

  // If loading but under 500ms, or fully loaded, render children
  return children;
};

export default ProtectedRoute;