import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordApi } from "../api/authApi";

/**
 * ResetPassword - Minimal UI
 * Calls POST /auth/reset-password with { email, otp, newPassword }
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email.trim()) {
      setMessage({ text: "Email is required", type: "error" });
      return;
    }

    if (!otp.trim()) {
      setMessage({ text: "OTP is required", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      setMessage({
        text: "Password reset successful! Redirecting...",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to reset password";
      setMessage({ text: String(msg), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!emailFromUrl) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "50px auto",
          padding: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 30,
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#dc2626" }}>Invalid Link</h3>
          <p>Missing email. Please request OTP again.</p>
          <Link
            to="/forgot-password"
            style={{ color: "#fc8019", fontWeight: 600 }}
          >
            Send OTP Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: "0 0 10px", color: "#fc8019" }}>Reset Password</h2>
        <p style={{ marginBottom: 20, color: "#686b78", fontSize: 14 }}>
          Enter OTP and new password
        </p>

        {message.text && (
          <div
            style={{
              padding: 10,
              marginBottom: 15,
              borderRadius: 4,
              background: message.type === "error" ? "#fee2e2" : "#dcfce7",
              color: message.type === "error" ? "#dc2626" : "#16a34a",
              fontSize: 14,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                marginBottom: 5,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                marginBottom: 5,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                marginBottom: 5,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              style={{
                display: "block",
                marginBottom: 5,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            />
            {confirmPassword && (
              <span
                style={{
                  fontSize: 12,
                  color:
                    newPassword === confirmPassword ? "#16a34a" : "#dc2626",
                }}
              >
                {newPassword === confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              background: loading ? "#ccc" : "#fc8019",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 15, fontSize: 14 }}>
          <Link
            to="/login"
            style={{ color: "#fc8019", textDecoration: "none" }}
          >
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
