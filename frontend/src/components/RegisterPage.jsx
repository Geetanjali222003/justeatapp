import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtpApi, registerApi } from "../api/authApi";
import AppToast from "./ui/AppToast";

/**
 * RegisterPage - Single page OTP-based registration
 * 1) collect user details
 * 2) call POST /auth/send-otp with email
 * 3) show OTP input field
 * 4) submit registration with OTP
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    return next;
  };

  const isValid = useMemo(() => Object.keys(validate()).length === 0, [form]);

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSendOtp = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Sending OTP to:", form.email);
      /** API call: POST /auth/send-otp */
      await sendOtpApi({ email: form.email.trim() });

      setOtpSent(true);
      setToast({
        show: true,
        message: "OTP sent successfully! Check your email.",
        type: "success",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to send OTP. Check backend server at http://localhost:8083";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    if (!/^\d{4,6}$/.test(otp.trim())) {
      setErrors({ otp: "Enter a valid OTP (4-6 digits)" });
      return;
    }

    setRegistering(true);
    try {
      const registrationData = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        otp: otp.trim(),
      };
      console.log("📝 Registering user with data:", registrationData);

      await registerApi(registrationData);

      setToast({
        show: true,
        message: "Registration successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Invalid OTP or registration failed";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "50px auto", padding: "20px" }}>
      <AppToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: "0 0 10px", color: "#fc8019" }}>Register</h2>
        <p style={{ marginBottom: 20, color: "#686b78", fontSize: 14 }}>
          {!otpSent
            ? "Create your account"
            : "Verify OTP to complete registration"}
        </p>

        {!otpSent ? (
          <form onSubmit={onSendOtp}>
            <div style={{ marginBottom: 15 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 5,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => onChange("username", e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
                required
              />
              {errors.username && (
                <span style={{ color: "red", fontSize: 12 }}>
                  {errors.username}
                </span>
              )}
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
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
                required
              />
              {errors.email && (
                <span style={{ color: "red", fontSize: 12 }}>
                  {errors.email}
                </span>
              )}
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
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => onChange("password", e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
                required
              />
              {errors.password && (
                <span style={{ color: "red", fontSize: 12 }}>
                  {errors.password}
                </span>
              )}
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
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => onChange("role", e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="OWNER">Restaurant Owner</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
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
        ) : (
          <form onSubmit={onRegister}>
            <div
              style={{
                marginBottom: 15,
                padding: 10,
                background: "#e8f5e9",
                borderRadius: 4,
              }}
            >
              <p style={{ margin: 0, fontSize: 13, color: "#2e7d32" }}>
                ✓ OTP sent to {form.email}
              </p>
            </div>

            {otpSent && (
              <div style={{ marginBottom: 15 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 5,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 4,
                  }}
                  required
                />
                {errors.otp && (
                  <span style={{ color: "red", fontSize: 12 }}>
                    {errors.otp}
                  </span>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setErrors({});
                }}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "#f5f5f5",
                  color: "#333",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!otp.trim() || registering}
                style={{
                  flex: 1,
                  padding: 12,
                  background: registering || !otp.trim() ? "#ccc" : "#fc8019",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontWeight: 600,
                  cursor:
                    registering || !otp.trim() ? "not-allowed" : "pointer",
                }}
              >
                {registering ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: 15,
            fontSize: 14,
            color: "#686b78",
          }}
        >
          Already registered?{" "}
          <Link
            to="/login"
            style={{
              color: "#fc8019",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
