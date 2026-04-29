import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/authApi";
import styles from "./Login.module.css";

/**
 * Simple Login Component
 *
 * Flow:
 *  1. User enters username + password and clicks "Sign In"
 *  2. Calls POST /auth/login via axios
 *  3. On success:
 *       - Saves role to localStorage
 *       - Redirects: OWNER → /owner-dashboard, CUSTOMER → /customer-home
 *  4. On failure:
 *       - Shows inline error message
 *
 * No JWT, no encryption - simple plain-text login for now.
 */
const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form fields on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(""); // clear error when user types
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Call POST /auth/login
      const { data } = await loginApi(form);

      // data = { message: "Login successful", role: "CUSTOMER" }
      console.log("Login response:", data);

      // Persist auth info for ProtectedRoute
      // If the backend doesn't return a JWT yet, store a simple flag.
      if (data?.token) {
        localStorage.setItem("token", data.token);
      } else {
        localStorage.setItem("token", "logged-in");
      }

      // Save role and username to localStorage for later use
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", form.username);

      // Redirect based on role
      if (data.role === "OWNER") {
        navigate("/owner-dashboard");
      } else if (data.role === "CUSTOMER") {
        navigate("/customer-home");
      } else if (data.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Show the error message from the backend (e.g. "Invalid username or password")
      const message =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Brand mark — consistent with Register page */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "2.4rem" }}>🍔</span>
          <h4
            style={{
              fontWeight: 800,
              color: "#fc8019",
              margin: "0.3rem 0 0",
              letterSpacing: "-0.5px",
            }}
          >
            FoodieExpress
          </h4>
        </div>

        <h2 className={styles.title}>Sign In</h2>
        <p className={styles.subtitle}>Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username Field */}
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className={styles.input}
            />
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={styles.input}
            />
          </div>

          {/* Error Message - shown only when login fails */}
          {errorMessage && (
            <div className={styles.errorBox} role="alert">
              ⚠ {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Forgot password link */}
          <div
            style={{
              textAlign: "center",
              marginTop: "0.75rem",
              fontSize: "0.85rem",
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                color: "#fc8019",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Forgot password?
            </Link>
          </div>
        </form>

        {/* Link to Register */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.85rem",
            color: "#686b78",
          }}
        >
          New here?{" "}
          <Link
            to="/register"
            style={{
              color: "#fc8019",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
