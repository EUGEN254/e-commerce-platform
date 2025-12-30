import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Spinner from '../components/ui/Spinner';

const ProtectedRoute = () => {
  const { admin, loading } = useAuth();
  const [showSpinner, setShowSpinner] = useState(false);

  // Only show spinner if loading takes longer than 500ms
  useEffect(() => {
    if (!loading) {
      setShowSpinner(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [loading]);

  // Not logged in → redirect to login
  if (!admin && !loading) {
    return <Navigate to="/login" replace />;
  }

  // While loading, show spinner only if it takes longer than 500ms
  if (loading && showSpinner) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size={40} className="text-blue-500" />
        </div>
      </div>
    );
  }

  // Still loading but under 500ms, or logged in → allow access
  return <Outlet />;
};

export default ProtectedRoute;
