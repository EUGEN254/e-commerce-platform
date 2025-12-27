// ProtectedRoute.jsx - MINIMAL VERSION
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // No artificial delay: render as soon as loading finishes to avoid flicker

  // Debug logs to help diagnose layout flicker
  // Debugging removed; keep placeholder logic minimal to avoid flicker

  // Preserve layout while auth state is being determined to avoid
  // content reflow/flicker (keeps footer position stable).
  if (loading) {
    // Placeholder fills available space so layout (footer) stays stable while auth loads
    return <div className="flex-1" aria-hidden />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;