import React from "react";
import { useNavigate } from "react-router-dom";

/** Shown when a user tries to access a route they don't have a role for. */
const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "120px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "3rem", color: "#ef4444" }}>403</h1>
      <h2>Access Denied</h2>
      <p style={{ color: "#6b7280" }}>
        You don't have permission to view this page.
      </p>
      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: "16px",
          padding: "10px 28px",
          background: "#667eea",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default Unauthorized;

