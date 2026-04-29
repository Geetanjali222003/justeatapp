import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../api/authApi";

/**
 * ForgotPassword
 * ──────────────
 * Lets a user enter their registered email address.
 * On submit it calls POST /auth/forgot-password with { email }.
 * The backend sends a password-reset link to that email.
 *
 * States:
 *   email       – controlled input value
 *   loading     – true while the API call is in-flight (disables button)
 *   successMsg  – shown when the backend responds 200
 *   errorMsg    – shown when the backend responds with an error
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ── Basic email format check ───────────────────────────────────────────── */
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  /* ── Form submit handler ────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMsg("");
    setErrorMsg("");

    // Client-side validation before hitting the network
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg(
        "Please enter a valid email address (e.g. user@example.com).",
      );
      return;
    }

    setLoading(true);
    try {
      /**
       * API CALL: POST /auth/forgot-password
       * Body: { email: "user@example.com" }
       * The backend looks up the user by email, generates a one-time token,
       * and emails a reset link containing that token to the user.
       */
      await forgotPasswordApi({ email: email.trim() });

      setSuccessMsg(
        "✅ Reset link sent! Check your inbox (and spam folder) for the password reset email.",
      );
      setEmail(""); // clear input after success
    } catch (err) {
      /**
       * err.response?.data may contain a backend error message.
       * Fall back to a generic message if nothing is available.
       */
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong. Please try again.";
      setErrorMsg(String(msg));
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0ebe1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-4 p-md-5"
        style={{ width: "100%", maxWidth: 440 }}
      >
        {/* Brand */}
        <div className="text-center mb-4">
          <span style={{ fontSize: "2.5rem" }}>🍔</span>
          <h4 className="fw-bold mt-2 mb-0" style={{ color: "#fc8019" }}>
            FoodieExpress
          </h4>
          <p className="text-muted mt-1" style={{ fontSize: "0.88rem" }}>
            Forgot your password?
          </p>
        </div>

        <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
          Reset Password
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>
          Enter the email linked to your account and we'll send you a reset
          link.
        </p>

        {/* Success banner */}
        {successMsg && (
          <div
            className="alert alert-success py-2 mb-3"
            style={{ fontSize: "0.85rem" }}
          >
            {successMsg}
          </div>
        )}

        {/* Error banner */}
        {errorMsg && (
          <div
            className="alert alert-danger py-2 mb-3"
            style={{ fontSize: "0.85rem" }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className="mb-3">
            <label
              htmlFor="fp-email"
              className="form-label fw-semibold"
              style={{ fontSize: "0.85rem", color: "#3d4152" }}
            >
              Email Address
            </label>
            <input
              id="fp-email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Submit button — shows spinner while loading */}
          <button
            type="submit"
            className="btn w-100 fw-bold py-2"
            style={{
              background: "#fc8019",
              color: "#fff",
              border: "none",
              borderRadius: 8,
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back to login link */}
        <div className="text-center mt-4" style={{ fontSize: "0.85rem" }}>
          <Link
            to="/login"
            style={{
              color: "#fc8019",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
