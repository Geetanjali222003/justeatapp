import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../components/LoginPage";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import RegisterPage from "../components/RegisterPage";
import OtpVerification from "../components/OtpVerification";
import Navbar from "../components/ui/Navbar";
import OwnerDashboard from "../pages/owner/OwnerDashboardV2";
import CustomerHome from "../pages/customer/CustomerDashboard";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";

/**
 * AppRouter — single source of truth for all client-side routes.
 *
 * Route map:
 *   /                → redirect to /login
 *   /login           → public Login page
 *   /owner-dashboard → OWNER only (ProtectedRoute)
 *   /customer-dashboard → CUSTOMER only (ProtectedRoute)
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* /reset-password?email=<value> — email is read inside the component */}
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
        path="/customer-dashboard"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <CustomerHome />
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
