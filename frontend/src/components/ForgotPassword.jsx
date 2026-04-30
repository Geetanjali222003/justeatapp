import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendResetOtpApi } from "../api/authApi";

/**
 * ForgotPassword - Minimal UI
 * Calls POST /auth/send-reset-otp to send OTP for password reset
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email.trim()) {
      setMessage({ text: "Please enter your email", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await sendResetOtpApi({ email: email.trim() });
      setMessage({ text: "OTP sent! Redirecting...", type: "success" });
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to send OTP";
      setMessage({ text: String(msg), type: "error" });
    } finally {
      setLoading(false);
    }
  };

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
        <h2 style={{ margin: "0 0 10px", color: "#fc8019" }}>
          Forgot Password
        </h2>
        <p style={{ marginBottom: 20, color: "#686b78", fontSize: 14 }}>
          Enter your email to receive OTP
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
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
            />
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
            {loading ? "Sending..." : "Send OTP"}
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

export default ForgotPassword;
