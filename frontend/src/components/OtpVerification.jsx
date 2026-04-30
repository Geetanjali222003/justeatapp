import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { registerApi, sendOtpApi } from "../api/authApi";
import AppButton from "./ui/AppButton";
import AppInput from "./ui/AppInput";
import AppToast from "./ui/AppToast";

/**
 * OtpVerification (Step 2)
 * Token/OTP handling:
 * - email is read from URL query (?email=...)
 * - user details are read from sessionStorage (pendingRegistration)
 * - POST /auth/register is called with all fields + otp
 */
const OtpVerification = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const emailFromUrl = params.get("email") || "";

  const pendingRaw = sessionStorage.getItem("pendingRegistration");
  const pending = pendingRaw ? JSON.parse(pendingRaw) : null;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const email = useMemo(
    () => pending?.email || emailFromUrl,
    [pending, emailFromUrl],
  );

  const verifyOtp = async (e) => {
    e.preventDefault();
    setFieldError("");

    if (!pending) {
      setToast({
        show: true,
        message: "Registration session expired. Start again.",
        type: "error",
      });
      return;
    }

    if (!/^\d{4,6}$/.test(otp.trim())) {
      setFieldError("Enter a valid OTP (4-6 digits)");
      return;
    }

    setLoading(true);
    try {
      const registrationData = { ...pending, otp: otp.trim() };
      console.log("📝 Registering user with data:", registrationData);
      /**
       * API call: POST /auth/register
       * backend validates OTP + creates user
       */
      await registerApi(registrationData);

      sessionStorage.removeItem("pendingRegistration");
      setToast({
        show: true,
        message: "Registration successful",
        type: "success",
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Wrong OTP or registration failed";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) return;
    setResending(true);
    try {
      await sendOtpApi({ email });
      setToast({ show: true, message: "OTP resent", type: "success" });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to resend OTP";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <AppToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 430,
          borderRadius: 14,
          boxShadow: "0 8px 24px rgba(0,0,0,.08)",
          padding: "2rem",
        }}
      >
        <h3 style={{ margin: 0, color: "#fc8019", fontWeight: 800 }}>
          OTP Verification
        </h3>
        <p style={{ marginTop: 8, color: "#686b78", fontSize: ".9rem" }}>
          Step 2: Enter OTP sent to <strong>{email || "your email"}</strong>
        </p>

        <form onSubmit={verifyOtp}>
          <AppInput
            id="otp-input"
            label="One Time Password"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setFieldError("");
            }}
            error={fieldError}
            placeholder="Enter OTP"
            required
          />

          <AppButton type="submit" fullWidth loading={loading}>
            Verify OTP & Register
          </AppButton>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            fontSize: ".85rem",
          }}
        >
          <button
            onClick={resendOtp}
            disabled={resending}
            style={{
              border: "none",
              background: "transparent",
              color: "#fc8019",
              fontWeight: 700,
            }}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
          <Link
            to="/register"
            style={{
              color: "#fc8019",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
