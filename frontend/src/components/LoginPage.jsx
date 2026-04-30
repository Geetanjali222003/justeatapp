import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import AppButton from "./ui/AppButton";
import AppInput from "./ui/AppInput";
import AppToast from "./ui/AppToast";

/**
 * LoginPage
 * Token handling:
 * - after successful login, JWT is stored in localStorage as `token`
 * - role is stored as `role` and used by ProtectedRoute
 */
const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password.trim()) next.password = "Password is required";
    return next;
  };

  const isValid = useMemo(() => Object.keys(validate()).length === 0, [form]);

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      /** API call: POST /auth/login */
      const { data } = await loginApi({
        username: form.username.trim(),
        password: form.password,
      });

      // Save auth context for protected routes + axios interceptor
      localStorage.setItem("token", data?.token || "");
      localStorage.setItem("role", data?.role || "");
      localStorage.setItem("username", data?.username || form.username.trim());

      if (data?.role === "OWNER") {
        navigate("/owner-dashboard");
      } else {
        navigate("/customer-home");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Invalid login credentials";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <AppToast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />

      <div style={{ background: "#fff", width: "100%", maxWidth: 430, borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,.08)", padding: "2rem" }}>
        <h3 style={{ margin: 0, color: "#fc8019", fontWeight: 800 }}>Login</h3>
        <p style={{ marginTop: 8, color: "#686b78", fontSize: ".9rem" }}>Welcome back to FoodieExpress</p>

        <form onSubmit={onSubmit}>
          <AppInput id="login-user" label="Username" value={form.username} onChange={(e) => onChange("username", e.target.value)} error={errors.username} required />
          <AppInput id="login-pass" label="Password" type="password" value={form.password} onChange={(e) => onChange("password", e.target.value)} error={errors.password} required />

          <AppButton type="submit" fullWidth loading={loading} disabled={!isValid}>
            Login
          </AppButton>
        </form>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: ".85rem" }}>
          <Link to="/register" style={{ color: "#fc8019", fontWeight: 700, textDecoration: "none" }}>
            Create account
          </Link>
          <Link to="/forgot-password" style={{ color: "#fc8019", textDecoration: "none" }}>
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
