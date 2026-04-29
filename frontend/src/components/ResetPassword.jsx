import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordApi } from "../api/authApi";

/**
 * ResetPassword
 * ─────────────
 * Displays a form for choosing a new password.
 *
 * TOKEN HANDLING:
 *   The backend emails a link like:
 *     http://localhost:3000/reset-password?token=<JWT_OR_UUID>
 *   We read that token from the URL using useSearchParams().
 *   It is then sent to the backend as part of the request body.
 *   If no token is present in the URL, we show an error immediately.
 *
 * VALIDATION (all client-side, before hitting the network):
 *   1. Both fields must be filled.
 *   2. Passwords must match.
 *   3. Minimum 8 characters.
 *   4. At least one uppercase letter  (A-Z).
 *   5. At least one lowercase letter  (a-z).
 *   6. At least one digit             (0-9).
 *   7. At least one special character (!@#$%^&* etc.)
 *
 * On success → redirects to /login with a flag so Login can show a toast.
 */
const ResetPassword = () => {
  /* ── Read token from URL ────────────────────────────────────────────────── */
  /**
   * useSearchParams gives us access to ?key=value pairs in the URL.
   * e.g. /reset-password?token=abc123  →  searchParams.get("token") === "abc123"
   */
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // null if not present

  const navigate = useNavigate();

  /* ── Form state ─────────────────────────────────────────────────────────── */
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false); // toggle visibility
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── UI feedback state ──────────────────────────────────────────────────── */
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldError, setFieldError] = useState(""); // inline field error

  /* ════════════════════════════════════════════════════════════════════════
     PASSWORD STRENGTH VALIDATION
     Returns an error string if the password fails any rule, else "".
  ════════════════════════════════════════════════════════════════════════ */
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter (A-Z).";
    if (!/[a-z]/.test(pwd))
      return "Password must contain at least one lowercase letter (a-z).";
    if (!/[0-9]/.test(pwd))
      return "Password must contain at least one number (0-9).";
    if (!/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]/.test(pwd))
      return "Password must contain at least one special character (!@#$%^&* …).";
    return ""; // all rules passed
  };

  /* ── Password strength meter (0-4) ─────────────────────────────────────── */
  const strengthScore = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]/.test(pwd)) score++;
    return score;
  };
  const score = strengthScore(newPassword);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score] || "";
  const strengthColor =
    ["", "#e06b7d", "#fc8019", "#4CC5CD", "#96be4b"][score] || "#e5e7eb";

  /* ── Form submit handler ────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldError("");
    setSuccessMsg("");

    // 1. Validate password strength
    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setFieldError(pwdError);
      return;
    }

    // 2. Check passwords match
    if (newPassword !== confirmPassword) {
      setFieldError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      /**
       * API CALL: POST /auth/reset-password
       * Body: { token: "<from URL>", newPassword: "<user input>" }
       *
       * The backend:
       *   1. Verifies the token is valid and not expired.
       *   2. Finds the user linked to the token.
       *   3. Hashes and saves the new password.
       *   4. Invalidates the token so it can't be reused.
       */
      await resetPasswordApi({ token, newPassword });

      setSuccessMsg("✅ Password reset successfully! Redirecting to login…");

      // Give the user 2 seconds to read the success message, then redirect.
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to reset password. The link may have expired. Please request a new one.";
      setErrorMsg(String(msg));
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════
     GUARD: no token in URL
  ════════════════════════════════════════════════════════════════════════ */
  if (!token) {
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
          className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center"
          style={{ width: "100%", maxWidth: 440 }}
        >
          <div style={{ fontSize: "3rem" }}>🔗</div>
          <h5 className="fw-bold mt-3" style={{ color: "#3d4152" }}>
            Invalid Reset Link
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
            This password reset link is missing a token. Please use the link
            from your email, or request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="btn fw-bold px-4"
            style={{
              background: "#fc8019",
              color: "#fff",
              border: "none",
              borderRadius: 8,
            }}
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════════
     MAIN RENDER
  ════════════════════════════════════════════════════════════════════════ */
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
            Create a new password
          </p>
        </div>

        <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
          Set New Password
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>
          Choose a strong password for your account.
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

        {/* API error banner */}
        {errorMsg && (
          <div
            className="alert alert-danger py-2 mb-3"
            style={{ fontSize: "0.85rem" }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* ── New Password ── */}
          <div className="mb-2">
            <label
              htmlFor="rp-new"
              className="form-label fw-semibold"
              style={{ fontSize: "0.85rem", color: "#3d4152" }}
            >
              New Password
            </label>
            <div className="input-group">
              <input
                id="rp-new"
                type={showNew ? "text" : "password"}
                className="form-control"
                placeholder="Min 8 chars, A-Z, a-z, 0-9, symbol"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFieldError("");
                }}
                disabled={loading}
                autoFocus
              />
              {/* Toggle show/hide password */}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
                style={{ fontSize: "0.85rem" }}
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Password strength meter */}
          {newPassword.length > 0 && (
            <div className="mb-3">
              <div className="d-flex gap-1 mb-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 99,
                      background: n <= score ? strengthColor : "#e5e7eb",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: strengthColor,
                  fontWeight: 600,
                }}
              >
                {strengthLabel}
              </span>
            </div>
          )}

          {/* ── Confirm Password ── */}
          <div className="mb-2">
            <label
              htmlFor="rp-confirm"
              className="form-label fw-semibold"
              style={{ fontSize: "0.85rem", color: "#3d4152" }}
            >
              Confirm Password
            </label>
            <div className="input-group">
              <input
                id="rp-confirm"
                type={showConfirm ? "text" : "password"}
                className="form-control"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldError("");
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                style={{ fontSize: "0.85rem" }}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Match indicator */}
          {confirmPassword.length > 0 && (
            <div className="mb-3" style={{ fontSize: "0.78rem" }}>
              {newPassword === confirmPassword ? (
                <span style={{ color: "#96be4b", fontWeight: 600 }}>
                  ✅ Passwords match
                </span>
              ) : (
                <span style={{ color: "#e06b7d", fontWeight: 600 }}>
                  ❌ Passwords do not match
                </span>
              )}
            </div>
          )}

          {/* Inline field validation error */}
          {fieldError && (
            <div
              className="alert alert-warning py-2 mb-3"
              style={{ fontSize: "0.82rem" }}
            >
              ⚠️ {fieldError}
            </div>
          )}

          {/* Password rules hint */}
          <ul
            className="mb-3 ps-3"
            style={{ fontSize: "0.78rem", color: "#686b78", lineHeight: 1.8 }}
          >
            <li
              style={{ color: newPassword.length >= 8 ? "#96be4b" : "inherit" }}
            >
              At least 8 characters
            </li>
            <li
              style={{
                color: /[A-Z]/.test(newPassword) ? "#96be4b" : "inherit",
              }}
            >
              One uppercase letter (A-Z)
            </li>
            <li
              style={{
                color: /[a-z]/.test(newPassword) ? "#96be4b" : "inherit",
              }}
            >
              One lowercase letter (a-z)
            </li>
            <li
              style={{
                color: /[0-9]/.test(newPassword) ? "#96be4b" : "inherit",
              }}
            >
              One number (0-9)
            </li>
            <li
              style={{
                color: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]/.test(
                  newPassword,
                )
                  ? "#96be4b"
                  : "inherit",
              }}
            >
              One special character (!@#$%^&* …)
            </li>
          </ul>

          {/* Submit */}
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
                Resetting…
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

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

export default ResetPassword;
