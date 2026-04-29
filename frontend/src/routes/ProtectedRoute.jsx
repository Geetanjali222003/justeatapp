import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — guards a route by role.
 *
 * Usage:
 *   <ProtectedRoute allowedRole="OWNER">
 *     <OwnerDashboard />
 *   </ProtectedRoute>
 *
 * If no token exists → redirect to /login.
 * If token exists but role doesn't match → redirect to /unauthorized.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // This project currently supports a simple role-based login.
  // Treat either a token or a stored role as "logged in".
  const isLoggedIn = Boolean(token || role);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
