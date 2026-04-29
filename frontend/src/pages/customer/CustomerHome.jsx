import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Bootstrap CSS is imported globally in index.js — no CSS module needed here.

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CustomerHome
 * ─────────────────────────────────────────────────────────────────────────────
 * Role-protected page for CUSTOMER users (food ordering portal).
 * Styled exclusively with Bootstrap 5 utility classes.
 *
 * Tabs:
 *   🏠 Dashboard  – stat cards + recent orders overview
 *   🍴 Menu       – food catalogue with Add-to-Cart
 *   🛒 Cart       – cart management + place order
 *   📦 My Orders  – full order history table
 *   👤 Profile    – user account details
 *
 * Key features:
 *   • Logout button → confirmation modal before signing out
 *   • Cart state managed with useState (add / remove / qty controls)
 *   • Veg / Non-veg colour-dot indicator on every menu item
 *   • Responsive layout: sidebar + main content area
 * ─────────────────────────────────────────────────────────────────────────────
 */
const CustomerHome = () => {
  /* ── Router & auth ──────────────────────────────────────────────────────── */
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Customer";

  /* ── UI state ───────────────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("dashboard"); // which section is visible
  const [showLogoutModal, setShowLogoutModal] = useState(false); // controls logout modal
  const [cart, setCart] = useState([]); // array of { ...menuItem, qty }

  /**
   * confirmLogout
   * Clears all auth keys from localStorage and redirects to the login page.
   * Called only after the user confirms in the modal.
   */
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  /**
   * addToCart
   * Adds one unit of `item` to the cart.
   * If the item already exists in cart, increments its qty instead.
   */
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      return [...prev, { ...item, qty: 1 }];
    });
  };

  /** Total number of units across all cart items */
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  /** Grand total price (₹) across all cart items */
  const cartTotal = cart.reduce((sum, c) => sum + c.rawPrice * c.qty, 0);

  /**
   * Stat cards shown on the Dashboard tab.
   * `color` maps to Bootstrap border-top utility classes (e.g. "border-warning").
   */
  const stats = [
    { label: "Total Orders", value: "12", icon: "🍽️", color: "border-warning" },
    { label: "Active Orders", value: "2", icon: "⏳", color: "border-info" },
    { label: "Delivered", value: "9", icon: "✅", color: "border-success" },
    { label: "Cancelled", value: "1", icon: "❌", color: "border-danger" },
  ];

  /**
   * Sample order history data.
   * TODO: Replace with real API call → GET /orders?customerId=...
   */
  const recentOrders = [
    {
      id: "#ORD-001",
      item: "Paneer Butter Masala + Naan",
      date: "2026-04-20",
      status: "Delivered",
      amount: "₹340",
      restaurant: "Spice Garden",
    },
    {
      id: "#ORD-002",
      item: "Chicken Biryani (Full)",
      date: "2026-04-22",
      status: "On the Way",
      amount: "₹280",
      restaurant: "Biryani House",
    },
    {
      id: "#ORD-003",
      item: "Margherita Pizza (Large)",
      date: "2026-04-25",
      status: "Delivered",
      amount: "₹450",
      restaurant: "Pizza Palace",
    },
    {
      id: "#ORD-004",
      item: "Masala Dosa + Filter Coffee",
      date: "2026-04-27",
      status: "Cancelled",
      amount: "₹180",
      restaurant: "South Tadka",
    },
  ];

  /**
   * Food menu catalogue.
   * `rawPrice` (number) is used for cart arithmetic.
   * `price`    (string) is the formatted display value.
   * `veg: true`  → green dot indicator; `false` → red dot.
   * TODO: Replace with real API call → GET /menu
   */
  const catalogue = [
    {
      id: 1,
      name: "Paneer Butter Masala",
      rawPrice: 220,
      price: "₹220",
      category: "Main Course",
      icon: "🍛",
      veg: true,
    },
    {
      id: 2,
      name: "Chicken Biryani",
      rawPrice: 280,
      price: "₹280",
      category: "Rice & Biryani",
      icon: "🍚",
      veg: false,
    },
    {
      id: 3,
      name: "Margherita Pizza",
      rawPrice: 350,
      price: "₹350",
      category: "Pizza",
      icon: "🍕",
      veg: true,
    },
    {
      id: 4,
      name: "Masala Dosa",
      rawPrice: 120,
      price: "₹120",
      category: "South Indian",
      icon: "🥘",
      veg: true,
    },
    {
      id: 5,
      name: "Grilled Chicken",
      rawPrice: 320,
      price: "₹320",
      category: "Starters",
      icon: "🍗",
      veg: false,
    },
    {
      id: 6,
      name: "Veg Hakka Noodles",
      rawPrice: 180,
      price: "₹180",
      category: "Chinese",
      icon: "🍜",
      veg: true,
    },
    {
      id: 7,
      name: "Chocolate Lava Cake",
      rawPrice: 150,
      price: "₹150",
      category: "Desserts",
      icon: "🍫",
      veg: true,
    },
    {
      id: 8,
      name: "Mango Lassi",
      rawPrice: 80,
      price: "₹80",
      category: "Beverages",
      icon: "🥤",
      veg: true,
    },
  ];

  /**
   * statusBadge
   * Returns the Bootstrap badge class string for a given order status.
   * Used in both the Dashboard preview table and the My Orders table.
   */
  const statusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge bg-success";
      case "On the Way":
        return "badge bg-primary";
      case "Cancelled":
        return "badge bg-danger";
      case "Pending":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  /**
   * CartBanner
   * Swiggy-style sticky orange strip shown when cart has items.
   */
  const CartBanner = () =>
    cart.length > 0 ? (
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3 rounded-3 mb-4"
        style={{ background: "#fc8019", color: "#fff" }}
      >
        <span className="fw-semibold">
          🛒 {cartCount} item{cartCount > 1 ? "s" : ""} &nbsp;|&nbsp; ₹
          {cartTotal}
        </span>
        <button
          className="btn btn-light btn-sm fw-bold text-dark px-3"
          onClick={() => setActiveTab("cart")}
        >
          View Cart →
        </button>
      </div>
    ) : null;

  /* ═══════════════════════════════════════════════════════════════════════════
     SECTION RENDERERS — one function per tab
  ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * renderDashboard
   * Swiggy-style dashboard: greeting banner, 4 stat cards, cart strip, recent orders.
   */
  const renderDashboard = () => (
    <>
      {/* Hero greeting banner */}
      <div
        className="rounded-3 p-4 mb-4 text-white"
        style={{ background: "linear-gradient(120deg,#fc8019,#fb6a00)" }}
      >
        <h3 className="fw-bold mb-1">Hey {username}! 👋</h3>
        <p className="mb-0 opacity-75">What are you craving today?</p>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3 h-100">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  background: "#fff4ec",
                  fontSize: "1.4rem",
                }}
              >
                {s.icon}
              </div>
              <div>
                <div className="fw-bold fs-4 lh-1" style={{ color: "#3d4152" }}>
                  {s.value}
                </div>
                <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                  {s.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart banner */}
      <CartBanner />

      {/* Recent orders */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0" style={{ color: "#3d4152" }}>
          Recent Orders
        </h5>
        <button
          className="btn btn-sm fw-semibold"
          style={{ color: "#fc8019", border: "1px solid #fc8019" }}
          onClick={() => setActiveTab("orders")}
        >
          View All
        </button>
      </div>

      <div className="bg-white rounded-3 shadow-sm overflow-hidden">
        {recentOrders.slice(0, 3).map((o, idx) => (
          <div
            key={o.id}
            className={`d-flex align-items-center justify-content-between px-4 py-3 ${
              idx !== 2 ? "border-bottom" : ""
            }`}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  background: "#fff4ec",
                  fontSize: "1.3rem",
                }}
              >
                🍽️
              </div>
              <div>
                <div
                  className="fw-semibold"
                  style={{ color: "#3d4152", fontSize: "0.9rem" }}
                >
                  {o.item}
                </div>
                <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                  {o.restaurant} · {o.date}
                </div>
              </div>
            </div>
            <div className="text-end">
              <div className="fw-bold" style={{ color: "#3d4152" }}>
                {o.amount}
              </div>
              <span
                className={statusBadge(o.status)}
                style={{ fontSize: "0.72rem" }}
              >
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  /**
   * renderOrders
   * Swiggy-style order history as stacked cards instead of a table.
   */
  const renderOrders = () => (
    <>
      <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
        My Orders 📦
      </h5>
      <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
        Track and manage all your food orders.
      </p>

      <div className="d-flex flex-column gap-3">
        {recentOrders.map((o) => (
          <div key={o.id} className="bg-white rounded-3 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                {/* Restaurant name */}
                <div className="fw-bold mb-1" style={{ color: "#3d4152" }}>
                  {o.restaurant}
                </div>
                {/* Item list */}
                <div
                  className="text-muted mb-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  {o.item}
                </div>
                {/* Order meta */}
                <div style={{ fontSize: "0.78rem", color: "#93959f" }}>
                  {o.id} &nbsp;·&nbsp; {o.date}
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold fs-6 mb-1" style={{ color: "#3d4152" }}>
                  {o.amount}
                </div>
                <span className={statusBadge(o.status)}>{o.status}</span>
              </div>
            </div>
            <hr className="my-3" />
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm fw-semibold flex-fill"
                style={{ border: "1.5px solid #fc8019", color: "#fc8019" }}
              >
                View Details
              </button>
              <button
                className="btn btn-sm fw-semibold flex-fill text-white"
                style={{ background: "#fc8019", border: "none" }}
                onClick={() => setActiveTab("browse")}
              >
                Reorder 🔄
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  /**
   * renderBrowse
   * Swiggy-style menu: horizontal category chips + food cards with +/- controls.
   */
  const renderBrowse = () => {
    const categories = ["All", ...new Set(catalogue.map((p) => p.category))];
    const [activeCat, setActiveCat] = useState("All");
    const filtered =
      activeCat === "All"
        ? catalogue
        : catalogue.filter((p) => p.category === activeCat);

    return (
      <>
        <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
          Menu 🍴
        </h5>
        <p className="text-muted mb-3" style={{ fontSize: "0.88rem" }}>
          Pick your favourites.
        </p>

        {/* Cart banner */}
        <CartBanner />

        {/* Category filter pills */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="btn btn-sm rounded-pill fw-semibold"
              style={{
                background: activeCat === cat ? "#fc8019" : "#fff",
                color: activeCat === cat ? "#fff" : "#3d4152",
                border: "1.5px solid #fc8019",
                fontSize: "0.8rem",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food cards */}
        <div className="row g-3">
          {filtered.map((p) => {
            const inCart = cart.find((i) => i.id === p.id);
            return (
              <div className="col-12 col-md-6" key={p.id}>
                <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3">
                  {/* Food emoji block */}
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 72,
                      height: 72,
                      background: "#fff4ec",
                      fontSize: "2rem",
                    }}
                  >
                    {p.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-grow-1">
                    {/* Veg/Non-veg square indicator (Swiggy style) */}
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          border: `2px solid ${p.veg ? "#16a34a" : "#dc2626"}`,
                          borderRadius: 3,
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            left: 2,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: p.veg ? "#16a34a" : "#dc2626",
                          }}
                        />
                      </span>
                      <span
                        className="fw-semibold"
                        style={{ color: "#3d4152", fontSize: "0.9rem" }}
                      >
                        {p.name}
                      </span>
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                      {p.category}
                    </div>
                    <div className="fw-bold mt-1" style={{ color: "#3d4152" }}>
                      {p.price}
                    </div>
                  </div>

                  {/* Add / qty controls */}
                  <div className="flex-shrink-0">
                    {!inCart ? (
                      <button
                        className="btn btn-sm fw-bold px-3"
                        style={{
                          border: "1.5px solid #fc8019",
                          color: "#fc8019",
                          minWidth: 72,
                        }}
                        onClick={() => addToCart(p)}
                      >
                        ADD
                      </button>
                    ) : (
                      <div
                        className="d-flex align-items-center rounded"
                        style={{
                          border: "1.5px solid #fc8019",
                          overflow: "hidden",
                          minWidth: 90,
                        }}
                      >
                        <button
                          className="btn btn-sm fw-bold px-2 py-1"
                          style={{
                            background: "#fc8019",
                            color: "#fff",
                            border: "none",
                            borderRadius: 0,
                          }}
                          onClick={() =>
                            setCart((prev) =>
                              inCart.qty === 1
                                ? prev.filter((i) => i.id !== p.id)
                                : prev.map((i) =>
                                    i.id === p.id
                                      ? { ...i, qty: i.qty - 1 }
                                      : i,
                                  ),
                            )
                          }
                        >
                          −
                        </button>
                        <span
                          className="fw-bold text-center flex-grow-1"
                          style={{ color: "#fc8019", fontSize: "0.9rem" }}
                        >
                          {inCart.qty}
                        </span>
                        <button
                          className="btn btn-sm fw-bold px-2 py-1"
                          style={{
                            background: "#fc8019",
                            color: "#fff",
                            border: "none",
                            borderRadius: 0,
                          }}
                          onClick={() => addToCart(p)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /**
   * renderCart
   * Swiggy-style cart: item rows with qty controls + bill summary card.
   */
  const renderCart = () => (
    <>
      <h5 className="fw-bold mb-4" style={{ color: "#3d4152" }}>
        My Cart 🛒
      </h5>

      {cart.length === 0 ? (
        /* Empty state */
        <div className="text-center py-5">
          <div style={{ fontSize: "4.5rem" }}>🛒</div>
          <h5 className="fw-bold mt-3" style={{ color: "#3d4152" }}>
            Your cart is empty
          </h5>
          <p className="text-muted">Good food is always cooking!</p>
          <button
            className="btn fw-bold px-4 mt-1"
            style={{ background: "#fc8019", color: "#fff", border: "none" }}
            onClick={() => setActiveTab("browse")}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left — cart items */}
          <div className="col-12 col-lg-8">
            <div className="bg-white rounded-3 shadow-sm p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#3d4152" }}>
                Items in Cart
              </h6>
              {cart.map((c, idx) => (
                <div key={c.id}>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    {/* Veg/Non-veg indicator */}
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          flexShrink: 0,
                          border: `2px solid ${c.veg ? "#16a34a" : "#dc2626"}`,
                          borderRadius: 3,
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            left: 2,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: c.veg ? "#16a34a" : "#dc2626",
                          }}
                        />
                      </span>
                      <div>
                        <div
                          className="fw-semibold"
                          style={{ color: "#3d4152", fontSize: "0.9rem" }}
                        >
                          {c.icon} {c.name}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.78rem" }}
                        >
                          ₹{c.rawPrice} each
                        </div>
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div className="d-flex align-items-center gap-2 mx-3">
                      <button
                        className="btn btn-sm d-flex align-items-center justify-content-center"
                        style={{
                          width: 28,
                          height: 28,
                          background: "#fc8019",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          padding: 0,
                        }}
                        onClick={() =>
                          setCart((prev) =>
                            c.qty === 1
                              ? prev.filter((i) => i.id !== c.id)
                              : prev.map((i) =>
                                  i.id === c.id ? { ...i, qty: i.qty - 1 } : i,
                                ),
                          )
                        }
                      >
                        −
                      </button>
                      <span
                        className="fw-bold"
                        style={{
                          minWidth: 16,
                          textAlign: "center",
                          color: "#3d4152",
                        }}
                      >
                        {c.qty}
                      </span>
                      <button
                        className="btn btn-sm d-flex align-items-center justify-content-center"
                        style={{
                          width: 28,
                          height: 28,
                          background: "#fc8019",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          padding: 0,
                        }}
                        onClick={() => addToCart(c)}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div
                      className="fw-bold"
                      style={{
                        color: "#3d4152",
                        minWidth: 60,
                        textAlign: "right",
                      }}
                    >
                      ₹{c.rawPrice * c.qty}
                    </div>
                  </div>
                  {idx !== cart.length - 1 && <hr className="my-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Bill Summary */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded-3 shadow-sm p-4">
              <h6
                className="fw-bold mb-3"
                style={{
                  color: "#3d4152",
                  textTransform: "uppercase",
                  fontSize: "0.78rem",
                  letterSpacing: 1,
                }}
              >
                Bill Details
              </h6>
              <div
                className="d-flex justify-content-between mb-2"
                style={{ fontSize: "0.88rem", color: "#3d4152" }}
              >
                <span>Item Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <div
                className="d-flex justify-content-between mb-2"
                style={{ fontSize: "0.88rem", color: "#3d4152" }}
              >
                <span>Delivery Fee</span>
                <span className="text-success">FREE</span>
              </div>
              <div
                className="d-flex justify-content-between mb-2"
                style={{ fontSize: "0.88rem", color: "#3d4152" }}
              >
                <span>Platform Fee</span>
                <span>₹5</span>
              </div>
              <hr />
              <div
                className="d-flex justify-content-between fw-bold"
                style={{ color: "#3d4152" }}
              >
                <span>To Pay</span>
                <span>₹{cartTotal + 5}</span>
              </div>
              <button
                className="btn w-100 fw-bold mt-4 py-2"
                style={{
                  background: "#fc8019",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "1rem",
                }}
              >
                Place Order 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  /**
   * renderProfile
   * Swiggy-style profile card with avatar, name and detail rows.
   */
  const renderProfile = () => (
    <>
      <h5 className="fw-bold mb-4" style={{ color: "#3d4152" }}>
        My Profile 👤
      </h5>

      <div
        className="bg-white rounded-3 shadow-sm p-4 mx-auto"
        style={{ maxWidth: 500 }}
      >
        {/* Avatar + name */}
        <div className="d-flex align-items-center gap-4 mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
            style={{
              width: 72,
              height: 72,
              background: "#fc8019",
              fontSize: "1.8rem",
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="fw-bold fs-5" style={{ color: "#3d4152" }}>
              {username}
            </div>
            <span
              className="badge"
              style={{ background: "#fc8019", fontSize: "0.75rem" }}
            >
              Customer
            </span>
          </div>
        </div>

        {/* Detail rows */}
        {[
          { label: "Username", value: username },
          { label: "Role", value: "Customer" },
          { label: "Total Orders", value: "12" },
          { label: "Member Since", value: "January 2026" },
          { label: "Favourite Cuisine", value: "North Indian 🍛" },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`d-flex justify-content-between align-items-center py-3 ${
              i !== arr.length - 1 ? "border-bottom" : ""
            }`}
          >
            <span className="text-muted" style={{ fontSize: "0.88rem" }}>
              {row.label}
            </span>
            <span
              className="fw-semibold"
              style={{ color: "#3d4152", fontSize: "0.88rem" }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  /** Renders the correct section component based on the active tab */
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "orders":
        return renderOrders();
      case "browse":
        return renderBrowse();
      case "cart":
        return renderCart();
      case "profile":
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  /**
   * Sidebar navigation items.
   * Cart label dynamically shows the item count when cart is non-empty.
   */
  const navItems = [
    { key: "dashboard", label: "🏠 Dashboard" },
    { key: "browse", label: "🍴 Menu" },
    { key: "cart", label: `🛒 Cart${cartCount > 0 ? ` (${cartCount})` : ""}` },
    { key: "orders", label: "📦 My Orders" },
    { key: "profile", label: "👤 Profile" },
  ];

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: "#f0ebe1", minHeight: "100vh" }}>
      {/* ─────────────────────────────────────────────────────────────────
          SWIGGY-STYLE TOPBAR
          White bar with orange brand, search input, username + logout.
      ───────────────────────────────────────────────────────────────── */}
      <nav
        className="d-flex align-items-center justify-content-between px-4 py-2"
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <span
          className="fw-bold fs-4"
          style={{ color: "#fc8019", letterSpacing: "-0.5px" }}
        >
          🍔 FoodieExpress
        </span>

        {/* Search bar */}
        <div
          className="d-none d-md-flex align-items-center rounded-pill px-3 py-1 gap-2"
          style={{ background: "#f0ebe1", width: 280 }}
        >
          <span style={{ color: "#93959f" }}>🔍</span>
          <input
            className="border-0 bg-transparent w-100"
            style={{ outline: "none", fontSize: "0.88rem", color: "#3d4152" }}
            placeholder="Search for dishes..."
          />
        </div>

        {/* User + logout */}
        <div className="d-flex align-items-center gap-3">
          <span
            className="fw-semibold d-none d-md-inline"
            style={{ color: "#3d4152", fontSize: "0.9rem" }}
          >
            👋 {username}
          </span>
          <button
            className="btn btn-sm fw-bold px-3"
            style={{
              background: "#fc8019",
              color: "#fff",
              border: "none",
              borderRadius: 6,
            }}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────
          HORIZONTAL TAB STRIP (replaces sidebar)
      ───────────────────────────────────────────────────────────────── */}
      <div
        className="d-flex gap-0"
        style={{
          background: "#fff",
          borderBottom: "2px solid #f0ebe1",
          overflowX: "auto",
        }}
      >
        {navItems.map((n) => (
          <button
            key={n.key}
            onClick={() => setActiveTab(n.key)}
            className="btn btn-sm fw-semibold px-4 py-3 rounded-0 border-0"
            style={{
              color: activeTab === n.key ? "#fc8019" : "#686b78",
              borderBottom:
                activeTab === n.key
                  ? "3px solid #fc8019"
                  : "3px solid transparent",
              background: "transparent",
              whiteSpace: "nowrap",
              fontSize: "0.88rem",
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          MAIN CONTENT
      ───────────────────────────────────────────────────────────────── */}
      <div className="container-lg py-4">{renderContent()}</div>

      {/* ─────────────────────────────────────────────────────────────────
          LOGOUT CONFIRMATION MODAL
          Rendered via a fixed overlay (no Bootstrap JS dependency needed).
          Cancel → setShowLogoutModal(false)
          Yes, Logout → confirmLogout()
      ───────────────────────────────────────────────────────────────── */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="modal-dialog modal-dialog-centered m-0">
            <div className="modal-content shadow-lg border-0 rounded-4">
              {/* Modal header */}
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Confirm Logout</h5>
              </div>

              {/* Modal body */}
              <div className="modal-body text-center py-4">
                <div style={{ fontSize: "3rem" }}>🍔</div>
                <p className="mt-3 text-muted">
                  Are you sure you want to logout from{" "}
                  <strong>FoodieExpress</strong>?
                </p>
              </div>

              {/* Modal footer */}
              <div className="modal-footer border-0 pt-0 justify-content-center gap-3">
                {/* Cancel — dismiss modal without logging out */}
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                {/* Confirm — clears auth data and redirects to /login */}
                <button
                  className="btn px-4 fw-bold text-white"
                  style={{ background: "#fc8019", border: "none" }}
                  onClick={confirmLogout}
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
