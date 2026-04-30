import { useEffect } from "react";

/**
 * AppToast
 * Simple top-right toast for API/success/error feedback.
 */
const AppToast = ({ show, message, type = "error", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [show, onClose, duration]);

  if (!show || !message) return null;

  const tone =
    type === "success"
      ? { bg: "#ecfdf3", border: "#86efac", text: "#166534", icon: "✅" }
      : { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c", icon: "⚠️" };

  return (
    <div
      style={{
        position: "fixed",
        top: 76,
        right: 16,
        zIndex: 9999,
        minWidth: 280,
        maxWidth: 420,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        color: tone.text,
        borderRadius: 10,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        padding: "10px 12px",
        fontSize: "0.88rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
      role="alert"
      aria-live="assertive"
    >
      <span>
        {tone.icon} {message}
      </span>
      <button
        onClick={onClose}
        style={{
          border: "none",
          background: "transparent",
          color: tone.text,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default AppToast;
