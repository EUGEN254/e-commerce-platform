// ProtectedRoute.jsx - MINIMAL VERSION
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useUser();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const location = useLocation();

  // Wait for initial auth check to complete
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setInitialCheckDone(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Preserve layout while auth state is being determined to avoid
  // content reflow/flicker (keeps footer position stable).
  if (loading || !initialCheckDone) {
    // Placeholder fills available space so layout (footer) stays stable
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