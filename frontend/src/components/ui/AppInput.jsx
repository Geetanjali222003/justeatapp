/**
 * AppInput — reusable labelled input field with inline error display
 * ──────────────────────────────────────────────────────────────────
 * Props:
 *   id          – links <label> htmlFor to <input> id (required for a11y)
 *   label       – text shown above the input
 *   type        – input type (text | email | password | number …)
 *   value       – controlled value
 *   onChange    – change handler
 *   placeholder – placeholder text
 *   error       – error string; renders a red hint below input when set
 *   disabled    – disables the input
 *   required    – shows asterisk next to label
 *   autoFocus   – focuses on mount
 *   rightAddon  – JSX rendered inside the input row on the right (e.g. Show/Hide toggle)
 *   style       – extra inline styles on the wrapper div
 */
const AppInput = ({
  id,
  label,
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  autoFocus = false,
  rightAddon = null,
  style = {},
}) => {
  /* ── Focus ring color matches the orange theme ──────────────────────── */
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${error ? "#e06b7d" : "#d1d5db"}`,
    borderRadius: 8,
    fontSize: "0.95rem",
    color: "#3d4152",
    background: disabled ? "#f3f4f6" : "#fff",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    /* Right padding when there is an addon (e.g. Show/Hide button) */
    paddingRight: rightAddon ? "5.5rem" : "14px",
  };

  return (
    <div style={{ marginBottom: "1rem", ...style }}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#3d4152",
          }}
        >
          {label}
          {/* Red asterisk for required fields */}
          {required && (
            <span style={{ color: "#e06b7d", marginLeft: 2 }}>*</span>
          )}
        </label>
      )}

      {/* Input wrapper — relative so the addon can be positioned inside */}
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          style={inputStyle}
          /* Orange focus ring */
          onFocus={(e) => {
            e.target.style.borderColor = "#fc8019";
            e.target.style.boxShadow = "0 0 0 3px rgba(252,128,25,0.18)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#e06b7d" : "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Optional right-side addon (e.g. Show/Hide password toggle) */}
        {rightAddon && (
          <div
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightAddon}
          </div>
        )}
      </div>

      {/* Inline error message */}
      {error && (
        <p
          role="alert"
          style={{
            marginTop: 4,
            fontSize: "0.78rem",
            color: "#e06b7d",
            fontWeight: 500,
          }}
        >
          ⚠ {error}
        </p>
      )}
    </div>
  );
};

export default AppInput;
