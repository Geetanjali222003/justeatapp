import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Navbar — sticky top navigation bar
 * ─────────────────────────────────────
 * • Shows the FoodieExpress brand logo (text-based).
 * • Links change based on whether the user is logged in (token in localStorage).
 *   - Logged out  → Login  |  Register
 *   - Logged in   → Dashboard  |  Logout
 * • Responsive: collapses to a hamburger on small screens via Bootstrap.
 *
 * Usage:  <Navbar />   — place at the top of any page or in App.jsx
 */
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  /* ── Hamburger open/close state for mobile ──────────────────────────── */
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── Dashboard path depends on user role ───────────────────────────── */
  const dashboardPath = () => {
    if (role === "OWNER") return "/owner-dashboard";
    return "/customer-dashboard";
  };

  /* ── Logout handler ─────────────────────────────────────────────────── */
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  /* ── Shared link style ──────────────────────────────────────────────── */
  const linkStyle = {
    color: "#3d4152",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
    padding: "6px 14px",
    borderRadius: 6,
    transition: "background 0.15s",
  };

  return (
    <nav
      style={{
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "0 1.25rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Brand logo ── */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.3rem",
              color: "#fc8019",
              letterSpacing: "-0.5px",
            }}
          >
            🍔 FoodieExpress
          </span>
        </Link>

        {/* ── Desktop nav links (hidden on xs/sm) ── */}
        <div className="d-none d-md-flex align-items-center gap-2">
          {token ? (
            /* Logged-in links */
            <>
              <span style={{ fontSize: "0.85rem", color: "#686b78" }}>
                👋 {username}
              </span>
              <Link to={dashboardPath()} style={linkStyle}>
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  ...linkStyle,
                  background: "#fc8019",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  padding: "7px 18px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            /* Logged-out links */
            <>
              <Link to="/login" style={linkStyle}>
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  ...linkStyle,
                  background: "#fc8019",
                  color: "#fff",
                  padding: "7px 18px",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger button ── */}
        <button
          className="d-md-none btn btn-sm"
          style={{
            border: "1.5px solid #d1d5db",
            color: "#3d4152",
            background: "none",
          }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div
          className="d-md-none"
          style={{
            background: "#fff",
            borderTop: "1px solid #f0ebe1",
            padding: "0.5rem 1.25rem 1rem",
          }}
        >
          {token ? (
            <>
              <div
                style={{
                  padding: "8px 0",
                  fontSize: "0.85rem",
                  color: "#686b78",
                }}
              >
                👋 {username}
              </div>
              <Link
                to={dashboardPath()}
                style={{ ...linkStyle, display: "block", padding: "8px 0" }}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  ...linkStyle,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "block",
                  padding: "8px 0",
                  color: "#e06b7d",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ ...linkStyle, display: "block", padding: "8px 0" }}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ ...linkStyle, display: "block", padding: "8px 0" }}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
