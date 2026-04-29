/**
 * AppButton — reusable button component
 * ──────────────────────────────────────
 * Props:
 *   children   – button label / content
 *   onClick    – click handler (optional; omit for form submit buttons)
 *   type       – "button" | "submit" | "reset"  (default: "button")
 *   disabled   – grays out and blocks interaction
 *   loading    – shows a spinner + "Loading…" text, also disables the button
 *   variant    – "primary" (orange filled) | "outline" (orange bordered) | "ghost" (text only)
 *   fullWidth  – stretches to 100% width
 *   style      – extra inline overrides
 *   className  – extra Bootstrap/custom classes
 */
const AppButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
  fullWidth = false,
  style = {},
  className = "",
}) => {
  /* ── Variant base styles ──────────────────────────────────────────────── */
  const variantStyles = {
    primary: {
      background: "#fc8019",
      color: "#fff",
      border: "2px solid #fc8019",
    },
    outline: {
      background: "transparent",
      color: "#fc8019",
      border: "2px solid #fc8019",
    },
    ghost: {
      background: "transparent",
      color: "#fc8019",
      border: "2px solid transparent",
    },
  };

  const base = {
    padding: "10px 22px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.65 : 1,
    transition: "opacity 0.2s, transform 0.1s, box-shadow 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    width: fullWidth ? "100%" : undefined,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={base}
      /* Lift slightly on hover — done via onMouseEnter/Leave for inline style */
      onMouseEnter={(e) => {
        if (!disabled && !loading)
          e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Spinner shown when loading=true */}
      {loading && (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
      )}
      {loading ? "Loading…" : children}
    </button>
  );
};

export default AppButton;
