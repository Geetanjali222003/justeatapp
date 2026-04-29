import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";
import AppButton from "./ui/AppButton";
import AppInput from "./ui/AppInput";

/**
 * Register
 * ─────────
 * Multi-step-style registration form:
 *   Step 1 – Fill username, email, password, role  →  click "Send OTP"
 *   Step 2 – OTP field appears  →  click "Create Account" to submit
 *
 * API CALL: POST /auth/register
 *   Body: { username, email, password, role, otp }
 *
 * VALIDATION (client-side):
 *   • Username  – 3+ chars, no spaces
 *   • Email     – valid format
 *   • Password  – 8+ chars, uppercase, lowercase, number, special char
 *   • OTP       – 6 digits (only after Send OTP clicked)
 *
 * On success → redirects to /login with a success note.
 */
const Register = () => {
  const navigate = useNavigate();

  /* ── Form values ───────────────────────────────────────────────────────── */
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER", // default role
    otp: "",
  });

  /* ── Per-field validation errors ───────────────────────────────────────── */
  const [errors, setErrors] = useState({});

  /* ── UI states ─────────────────────────────────────────────────────────── */
  const [otpSent, setOtpSent] = useState(false); // shows OTP field after "Send OTP"
  const [otpLoading, setOtpLoading] = useState(false); // loading for Send OTP button
  const [regLoading, setRegLoading] = useState(false); // loading for Register button
  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);

  /* ════════════════════════════════════════════════════════════════════════
     VALIDATION HELPERS
  ════════════════════════════════════════════════════════════════════════ */

  /** Returns an error string or "" for a given field */
  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required.";
        if (value.trim().length < 3)
          return "Username must be at least 3 characters.";
        if (/\s/.test(value)) return "Username must not contain spaces.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email (e.g. user@example.com).";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(value))
          return "Password needs at least one uppercase letter.";
        if (!/[a-z]/.test(value))
          return "Password needs at least one lowercase letter.";
        if (!/[0-9]/.test(value)) return "Password needs at least one number.";
        if (!/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]/.test(value))
          return "Password needs at least one special character.";
        return "";
      case "otp":
        if (!value.trim()) return "OTP is required.";
        if (!/^\d{6}$/.test(value.trim()))
          return "OTP must be exactly 6 digits.";
        return "";
      default:
        return "";
    }
  };

  /** Validate all required fields; returns errors object */
  const validateAll = (includeOtp = false) => {
    const fields = ["username", "email", "password"];
    if (includeOtp) fields.push("otp");
    const errs = {};
    fields.forEach((f) => {
      const e = validateField(f, form[f]);
      if (e) errs[f] = e;
    });
    return errs;
  };

  /* ── On change: update value + clear that field's error ─────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setApiError("");
  };

  /* ════════════════════════════════════════════════════════════════════════
     SEND OTP
     Validates step-1 fields first, then calls the OTP endpoint (or mocks it).
     The backend is expected to have POST /auth/send-otp  { email }.
     If not implemented yet, we simply reveal the OTP field so the user can
     enter whatever the backend already sent via /auth/register flow.
  ════════════════════════════════════════════════════════════════════════ */
  const handleSendOtp = async () => {
    const errs = validateAll(false);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setOtpLoading(true);
    setApiError("");
    try {
      /**
       * API CALL (optional): POST /auth/send-otp
       * Body: { email }
       * If your backend handles OTP inside /auth/register directly,
       * you can remove this call and just reveal the OTP field.
       */
      // await sendOtpApi({ email: form.email });   // uncomment when backend supports it

      setOtpSent(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to send OTP. Try again.";
      setApiError(String(msg));
    } finally {
      setOtpLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════
     REGISTER
  ════════════════════════════════════════════════════════════════════════ */
  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    // Validate all fields including OTP
    const errs = validateAll(true);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setRegLoading(true);
    try {
      /**
       * API CALL: POST /auth/register
       * Body: { username, email, password, role, otp }
       */
      await registerApi({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        otp: form.otp.trim(),
      });

      setSuccessMsg("🎉 Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Registration failed. Please try again.";
      setApiError(String(msg));
    } finally {
      setRegLoading(false);
    }
  };

  /* ── Password strength ───────────────────────────────────────────────── */
  const strengthScore = (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]/.test(pwd)) s++;
    return s;
  };
  const score = strengthScore(form.password);
  const sLabel = ["", "Weak", "Fair", "Good", "Strong"][score] || "";
  const sColor =
    ["", "#e06b7d", "#fc8019", "#4CC5CD", "#96be4b"][score] || "#e5e7eb";

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    /* Page wrapper — matches the Login page background exactly */
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem 1rem",
      }}
    >
      {/* ── Card ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: 460,
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "2.4rem" }}>🍔</span>
          <h4
            style={{
              fontWeight: 800,
              color: "#fc8019",
              margin: "0.4rem 0 0",
              letterSpacing: "-0.5px",
            }}
          >
            FoodieExpress
          </h4>
          <p
            style={{
              color: "#686b78",
              fontSize: "0.85rem",
              margin: "0.2rem 0 0",
            }}
          >
            Create your account
          </p>
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            fontSize: "0.78rem",
          }}
        >
          {["Account Details", "Verify OTP"].map((step, i) => {
            const active = i === 0 ? true : otpSent;
            return (
              <span
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: active ? "#fc8019" : "#e5e7eb",
                    color: active ? "#fff" : "#9ca3af",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    color: active ? "#3d4152" : "#9ca3af",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {step}
                </span>
                {i === 0 && (
                  <span style={{ color: "#d1d5db", margin: "0 0.25rem" }}>
                    →
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Success banner */}
        {successMsg && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#15803d",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {successMsg}
          </div>
        )}

        {/* API error banner */}
        {apiError && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#b91c1c",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            ⚠ {apiError}
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          {/* ── Username ── */}
          <AppInput
            id="reg-username"
            label="Username"
            required
            placeholder="e.g. john_doe"
            value={form.username}
            error={errors.username}
            onChange={(e) =>
              handleChange({
                target: { name: "username", value: e.target.value },
              })
            }
          />

          {/* ── Email ── */}
          <AppInput
            id="reg-email"
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) =>
              handleChange({ target: { name: "email", value: e.target.value } })
            }
          />

          {/* ── Password ── */}
          <AppInput
            id="reg-password"
            label="Password"
            type={showPass ? "text" : "password"}
            required
            placeholder="Min 8 chars, A-Z, a-z, 0-9, symbol"
            value={form.password}
            error={errors.password}
            onChange={(e) =>
              handleChange({
                target: { name: "password", value: e.target.value },
              })
            }
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#686b78",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            }
          />

          {/* Password strength bar */}
          {form.password.length > 0 && (
            <div style={{ marginTop: "-0.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 99,
                      background: n <= score ? sColor : "#e5e7eb",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <span
                style={{ fontSize: "0.72rem", color: sColor, fontWeight: 700 }}
              >
                {sLabel}
              </span>
            </div>
          )}

          {/* ── Role selector ── */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#3d4152",
              }}
            >
              Register as <span style={{ color: "#e06b7d" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["CUSTOMER", "OWNER"].map((r) => (
                <label
                  key={r}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    padding: "9px 0",
                    border: `1.5px solid ${form.role === r ? "#fc8019" : "#d1d5db"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: form.role === r ? "#fc8019" : "#686b78",
                    background: form.role === r ? "#fff4ec" : "#fff",
                    transition: "all 0.15s",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "role", value: e.target.value },
                      })
                    }
                    style={{ accentColor: "#fc8019" }}
                  />
                  {r === "CUSTOMER" ? "🛒 Customer" : "🏪 Owner"}
                </label>
              ))}
            </div>
          </div>

          {/* ── Send OTP button (step 1) ── */}
          {!otpSent && (
            <AppButton
              type="button"
              fullWidth
              loading={otpLoading}
              onClick={handleSendOtp}
              style={{ marginBottom: "0.75rem" }}
            >
              📧 Send OTP
            </AppButton>
          )}

          {/* ── OTP field — appears after Send OTP is clicked ── */}
          {otpSent && (
            <>
              <div
                style={{
                  background: "#fff4ec",
                  border: "1px solid #fcd9b4",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: "0.82rem",
                  color: "#92400e",
                  marginBottom: "0.75rem",
                }}
              >
                📬 An OTP has been sent to <strong>{form.email}</strong>. Enter
                it below.
              </div>

              <AppInput
                id="reg-otp"
                label="One-Time Password (OTP)"
                required
                placeholder="6-digit code"
                value={form.otp}
                error={errors.otp}
                onChange={(e) =>
                  handleChange({
                    target: { name: "otp", value: e.target.value },
                  })
                }
              />

              {/* ── Register button (step 2) ── */}
              <AppButton type="submit" fullWidth loading={regLoading}>
                🚀 Create Account
              </AppButton>

              {/* Resend OTP */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "0.75rem",
                  fontSize: "0.82rem",
                }}
              >
                <span style={{ color: "#686b78" }}>Didn't receive it? </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fc8019",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    padding: 0,
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}
        </form>

        {/* ── Link to Login ── */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "0.85rem",
            color: "#686b78",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#fc8019",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
