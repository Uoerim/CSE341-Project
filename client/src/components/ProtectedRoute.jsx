import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { getToken, removeToken, verifyToken } from "../services";
import './protectedRoute.css';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return; // Only check once
    hasChecked.current = true;

    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const user = await verifyToken(token);
        if (user) {
          localStorage.setItem("userId", user._id);
          setIsAuthenticated(true);
        } else {
          removeToken();
          setIsAuthenticated(false);
        }
      } catch (error) {
        removeToken();
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
