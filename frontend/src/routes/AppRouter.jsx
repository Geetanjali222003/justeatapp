import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import Register from "../components/Register";
import Navbar from "../components/ui/Navbar";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import CustomerHome from "../pages/customer/CustomerHome";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";

/**
 * AppRouter — single source of truth for all client-side routes.
 *
 * Route map:
 *   /                → redirect to /login
 *   /login           → public Login page
 *   /owner-dashboard → OWNER only (ProtectedRoute)
 *   /customer-home   → CUSTOMER only (ProtectedRoute)
 *   /admin-dashboard → ADMIN only (ProtectedRoute)
 *   /unauthorized    → shown when role doesn't match
 *   *                → 404 fallback redirects to /login
 */
const AppRouter = () => (
  <BrowserRouter>
    {/* Navbar is rendered on every page; it reads localStorage to show correct links */}
    <Navbar />
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* /reset-password?token=<value> — token is read inside the component */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* OWNER protected */}
      <Route
        path="/owner-dashboard"
        element={
          <ProtectedRoute allowedRole="OWNER">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* CUSTOMER protected */}
      <Route
        path="/customer-home"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerHome />
          </ProtectedRoute>
        }
      />

      {/* ADMIN protected */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Access denied */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
