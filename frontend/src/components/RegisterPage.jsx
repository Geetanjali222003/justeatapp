import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtpApi } from "../api/authApi";
import AppButton from "./ui/AppButton";
import AppInput from "./ui/AppInput";
import AppToast from "./ui/AppToast";

/**
 * RegisterPage (Step 1)
 * 1) collect user details
 * 2) call POST /auth/send-otp with email
 * 3) store draft data in sessionStorage
 * 4) redirect to OTP page
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

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
      /** API call: POST /auth/send-otp */
      await sendOtpApi({ email: form.email.trim() });

      // keep form values only until OTP verification completes
      sessionStorage.setItem("pendingRegistration", JSON.stringify(form));

      setToast({ show: true, message: "OTP sent successfully", type: "success" });
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(form.email.trim())}`);
      }, 500);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to send OTP";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <AppToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />

      <div style={{ background: "#fff", width: "100%", maxWidth: 460, borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,.08)", padding: "2rem" }}>
        <h3 style={{ margin: 0, color: "#fc8019", fontWeight: 800 }}>Create Account</h3>
        <p style={{ marginTop: 6, color: "#686b78", fontSize: ".9rem" }}>Step 1: Enter details and receive OTP</p>

        <form onSubmit={onSendOtp}>
          <AppInput id="reg-username" label="Username" value={form.username} onChange={(e) => onChange("username", e.target.value)} error={errors.username} required />
          <AppInput id="reg-email" label="Email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} error={errors.email} required />
          <AppInput id="reg-password" label="Password" type="password" value={form.password} onChange={(e) => onChange("password", e.target.value)} error={errors.password} required />

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, color: "#3d4152", marginBottom: 6 }}>Role</label>
            <select
              value={form.role}
              onChange={(e) => onChange("role", e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #d1d5db" }}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>

          <AppButton type="submit" fullWidth loading={loading} disabled={!isValid}>
            Send OTP
          </AppButton>
        </form>

        <p style={{ textAlign: "center", marginTop: 14, color: "#686b78", fontSize: ".88rem" }}>
          Already registered? <Link to="/login" style={{ color: "#fc8019", fontWeight: 700, textDecoration: "none" }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
