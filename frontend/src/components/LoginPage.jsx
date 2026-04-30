import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";

/**
 * LoginPage - Minimal UI
 * Blocks login if backend returns 401 (user not registered)
 */
const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter your credentials");
      return;
    }

    setLoading(true);
    try {
      const { data } = await loginApi({
        username: form.username.trim(),
        password: form.password,
      });

      if (!data?.role) {
        setError("Login failed: no role returned");
        return;
      }

      localStorage.setItem("token", data.token || "logged-in");
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username || form.username.trim());

      // Role-based redirect
      if (data.role === "OWNER") {
        navigate("/owner-dashboard");
      } else if (data.role === "CUSTOMER") {
        navigate("/customer-dashboard");
      } else {
        localStorage.clear();
        setError(`Unknown role: ${data.role}`);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError(
          "User not registered or invalid credentials. Please register first.",
        );
      } else {
        const msg =
          err?.response?.data?.message || err?.response?.data || "Login failed";
        setError(String(msg));
      }
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
        <h2 style={{ margin: "0 0 10px", color: "#fc8019" }}>Login</h2>
        <p style={{ marginBottom: 20, color: "#686b78", fontSize: 14 }}>
          Sign in to your account
        </p>

        {error && (
          <div
            style={{
              padding: 10,
              marginBottom: 15,
              borderRadius: 4,
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
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
              placeholder="Enter username"
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
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Enter password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "right", marginTop: 10, fontSize: 13 }}>
          <Link
            to="/forgot-password"
            style={{ color: "#fc8019", textDecoration: "none" }}
          >
            Forgot password?
          </Link>
        </p>

        <div
          style={{
            marginTop: 15,
            padding: 12,
            background: "#fff4ec",
            borderRadius: 4,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#fc8019",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
