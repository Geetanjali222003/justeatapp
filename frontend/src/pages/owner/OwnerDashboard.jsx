import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Bootstrap CSS imported globally in index.js

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * OwnerDashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Role-protected page for OWNER users (food ordering app).
 * Layout inspired by the classic Bootstrap profile panel:
 *   LEFT  — sticky profile nav card (avatar, name, nav pills)
 *   RIGHT — active section content
 *
 * Sections (nav pills):
 *   👤 Profile        – owner info card
 *   🏪 My Restaurants – add & view owned restaurants
 *   🍽️ Food Items     – add food items to restaurants
 *   📦 Orders         – view orders + advance status pipeline
 *   📊 Analytics      – quick stats overview
 *
 * Features:
 *   • Add restaurant form (name, city, cuisine, rating)
 *   • Add food item form (name, price, category, veg toggle, restaurant)
 *   • Order status pipeline: Pending → Preparing → Out for Delivery → Completed
 *   • Logout with confirmation modal
 * ─────────────────────────────────────────────────────────────────────────────
 */
const OwnerDashboard = () => {
  /* ── Auth & router ──────────────────────────────────────────────────────── */
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Owner";

  /* ── UI state ───────────────────────────────────────────────────────────── */
  const [activeSection, setActiveSection] = useState("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  /* ── Restaurants ────────────────────────────────────────────────────────── */
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Spice Garden",
      city: "Delhi",
      cuisine: "North Indian",
      rating: 4.3,
      active: true,
    },
    {
      id: 2,
      name: "Biryani House",
      city: "Hyderabad",
      cuisine: "Biryani",
      rating: 4.6,
      active: true,
    },
    {
      id: 3,
      name: "Pizza Palace",
      city: "Mumbai",
      cuisine: "Italian",
      rating: 4.1,
      active: false,
    },
  ]);
  const emptyRest = { name: "", city: "", cuisine: "", rating: "" };
  const [restForm, setRestForm] = useState(emptyRest);
  const [restErr, setRestErr] = useState("");

  /* ── Food items ─────────────────────────────────────────────────────────── */
  const [foodItems, setFoodItems] = useState([
    {
      id: 1,
      name: "Paneer Butter Masala",
      price: 220,
      category: "Main Course",
      veg: true,
      restaurantId: 1,
      icon: "🍛",
    },
    {
      id: 2,
      name: "Chicken Biryani",
      price: 280,
      category: "Rice & Biryani",
      veg: false,
      restaurantId: 2,
      icon: "🍚",
    },
    {
      id: 3,
      name: "Margherita Pizza",
      price: 350,
      category: "Pizza",
      veg: true,
      restaurantId: 3,
      icon: "🍕",
    },
    {
      id: 4,
      name: "Mango Lassi",
      price: 80,
      category: "Beverages",
      veg: true,
      restaurantId: 1,
      icon: "🥤",
    },
  ]);
  const emptyFood = {
    name: "",
    price: "",
    category: "",
    veg: true,
    restaurantId: "",
    icon: "🍽️",
  };
  const [foodForm, setFoodForm] = useState(emptyFood);
  const [foodErr, setFoodErr] = useState("");

  /* ── Orders ─────────────────────────────────────────────────────────────── */
  const STATUS_PIPELINE = [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Completed",
  ];

  const [orders, setOrders] = useState([
    {
      id: "#ORD-001",
      customer: "Alice",
      item: "Paneer Butter Masala + Naan",
      restaurant: "Spice Garden",
      amount: 340,
      date: "2026-04-27",
      status: "Completed",
    },
    {
      id: "#ORD-002",
      customer: "Bob",
      item: "Chicken Biryani (Full)",
      restaurant: "Biryani House",
      amount: 280,
      date: "2026-04-28",
      status: "Out for Delivery",
    },
    {
      id: "#ORD-003",
      customer: "Carol",
      item: "Margherita Pizza (Large)",
      restaurant: "Pizza Palace",
      amount: 450,
      date: "2026-04-29",
      status: "Preparing",
    },
    {
      id: "#ORD-004",
      customer: "Dave",
      item: "Mango Lassi × 2",
      restaurant: "Spice Garden",
      amount: 160,
      date: "2026-04-29",
      status: "Pending",
    },
  ]);

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  /** Advance an order one step along the status pipeline */
  const advanceStatus = (orderId) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = STATUS_PIPELINE.indexOf(o.status);
        return idx < STATUS_PIPELINE.length - 1
          ? { ...o, status: STATUS_PIPELINE[idx + 1] }
          : o;
      }),
    );

  /** Bootstrap badge class for a given order status */
  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "badge bg-warning text-dark";
      case "Preparing":
        return "badge bg-info text-dark";
      case "Out for Delivery":
        return "badge bg-primary";
      case "Completed":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };

  /** Next status label (null if already Completed) */
  const nextStatus = (status) => {
    const idx = STATUS_PIPELINE.indexOf(status);
    return idx < STATUS_PIPELINE.length - 1 ? STATUS_PIPELINE[idx + 1] : null;
  };

  /** Logout — clears localStorage and redirects to /login */
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  /* ── Stats for analytics ────────────────────────────────────────────────── */
  const stats = [
    {
      label: "Restaurants",
      value: restaurants.length,
      icon: "🏪",
      color: "#fc8019",
    },
    {
      label: "Food Items",
      value: foodItems.length,
      icon: "🍽️",
      color: "#4CC5CD",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "📦",
      color: "#96be4b",
    },
    {
      label: "Pending Orders",
      value: orders.filter((o) => o.status === "Pending").length,
      icon: "⏳",
      color: "#e06b7d",
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     LEFT NAV ITEMS
  ═══════════════════════════════════════════════════════════════════════════ */
  const navPills = [
    { key: "profile", icon: "fa fa-user", label: "Profile" },
    { key: "analytics", icon: "fa fa-bar-chart", label: "Analytics" },
    { key: "restaurants", icon: "fa fa-cutlery", label: "My Restaurants" },
    { key: "fooditems", icon: "fa fa-list", label: "Food Items" },
    { key: "orders", icon: "fa fa-shopping-bag", label: "Orders" },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     SECTION RENDERERS
  ═══════════════════════════════════════════════════════════════════════════ */

  /* ── Profile ─────────────────────────────────────────────────────────────── */
  const renderProfile = () => (
    <div className="bg-white rounded-3 shadow-sm p-4">
      {/* Bio heading */}
      <div
        className="p-3 rounded-3 mb-4 text-white"
        style={{
          background: "linear-gradient(120deg,#fc8019,#fb6a00)",
          fontSize: "0.9rem",
        }}
      >
        Running {restaurants.length} restaurant
        {restaurants.length !== 1 ? "s" : ""} on FoodieExpress. Keep your menu
        fresh and orders moving!
      </div>

      <h6
        className="fw-bold mb-3"
        style={{
          color: "#3d4152",
          textTransform: "uppercase",
          fontSize: "0.78rem",
          letterSpacing: 1,
        }}
      >
        Owner Info
      </h6>

      {[
        { label: "Username", value: username },
        { label: "Role", value: "Owner" },
        { label: "Restaurants", value: restaurants.length },
        { label: "Food Items", value: foodItems.length },
        { label: "Total Orders", value: orders.length },
        { label: "Member Since", value: "January 2026" },
      ].map((row, i, arr) => (
        <div
          key={row.label}
          className={`d-flex justify-content-between align-items-center py-3 ${i !== arr.length - 1 ? "border-bottom" : ""}`}
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
  );

  /* ── Analytics ───────────────────────────────────────────────────────────── */
  const renderAnalytics = () => (
    <>
      <h5 className="fw-bold mb-4" style={{ color: "#3d4152" }}>
        📊 Analytics
      </h5>

      {/* Stat cards — inspired by bio-chart panels */}
      <div className="row g-4 mb-4">
        {stats.map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div
              className="bg-white rounded-3 shadow-sm p-4 text-center"
              style={{ borderTop: `4px solid ${s.color}` }}
            >
              <div style={{ fontSize: "2.2rem" }}>{s.icon}</div>
              <div className="fw-bold fs-3 mt-2" style={{ color: "#3d4152" }}>
                {s.value}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: "0.78rem" }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      <div className="bg-white rounded-3 shadow-sm p-4">
        <h6 className="fw-bold mb-3" style={{ color: "#3d4152" }}>
          Order Status Breakdown
        </h6>
        {STATUS_PIPELINE.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const pct = orders.length
            ? Math.round((count / orders.length) * 100)
            : 0;
          const colors = {
            Pending: "#e06b7d",
            Preparing: "#4CC5CD",
            "Out for Delivery": "#fc8019",
            Completed: "#96be4b",
          };
          return (
            <div key={s} className="mb-3">
              <div
                className="d-flex justify-content-between mb-1"
                style={{ fontSize: "0.85rem" }}
              >
                <span className="fw-semibold" style={{ color: "#3d4152" }}>
                  {s}
                </span>
                <span style={{ color: colors[s] }}>
                  {count} order{count !== 1 ? "s" : ""} ({pct}%)
                </span>
              </div>
              <div className="progress" style={{ height: 8, borderRadius: 99 }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${pct}%`,
                    background: colors[s],
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  /* ── Restaurants ─────────────────────────────────────────────────────────── */
  const renderRestaurants = () => {
    const handleAdd = (e) => {
      e.preventDefault();
      if (
        !restForm.name.trim() ||
        !restForm.city.trim() ||
        !restForm.cuisine.trim()
      ) {
        setRestErr("Name, city and cuisine are required.");
        return;
      }
      setRestaurants((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: restForm.name.trim(),
          city: restForm.city.trim(),
          cuisine: restForm.cuisine.trim(),
          rating: parseFloat(restForm.rating) || 4.0,
          active: true,
        },
      ]);
      setRestForm(emptyRest);
      setRestErr("");
    };

    return (
      <>
        <h5 className="fw-bold mb-4" style={{ color: "#3d4152" }}>
          🏪 My Restaurants
        </h5>

        {/* Add restaurant form */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3" style={{ color: "#3d4152" }}>
            ➕ Add New Restaurant
          </h6>
          {restErr && (
            <div
              className="alert alert-danger py-2 mb-3"
              style={{ fontSize: "0.85rem" }}
            >
              {restErr}
            </div>
          )}
          <form onSubmit={handleAdd}>
            <div className="row g-3">
              {[
                {
                  label: "Restaurant Name *",
                  field: "name",
                  placeholder: "e.g. Spice Garden",
                  type: "text",
                },
                {
                  label: "City *",
                  field: "city",
                  placeholder: "e.g. Delhi",
                  type: "text",
                },
                {
                  label: "Cuisine *",
                  field: "cuisine",
                  placeholder: "e.g. North Indian",
                  type: "text",
                },
                {
                  label: "Rating (1–5)",
                  field: "rating",
                  placeholder: "e.g. 4.3",
                  type: "number",
                },
              ].map((f) => (
                <div className="col-12 col-md-6" key={f.field}>
                  <label
                    className="form-label fw-semibold"
                    style={{ fontSize: "0.85rem", color: "#3d4152" }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    className="form-control"
                    placeholder={f.placeholder}
                    value={restForm[f.field]}
                    min={f.type === "number" ? 1 : undefined}
                    max={f.type === "number" ? 5 : undefined}
                    step={f.type === "number" ? "0.1" : undefined}
                    onChange={(e) =>
                      setRestForm({ ...restForm, [f.field]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div className="col-12">
                <button
                  type="submit"
                  className="btn fw-bold px-4"
                  style={{
                    background: "#fc8019",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Add Restaurant
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Restaurant cards */}
        <div className="row g-3">
          {restaurants.map((r) => (
            <div className="col-12 col-md-6" key={r.id}>
              <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white fw-bold"
                  style={{
                    width: 52,
                    height: 52,
                    background: "#fc8019",
                    fontSize: "1.4rem",
                  }}
                >
                  🏪
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold" style={{ color: "#3d4152" }}>
                    {r.name}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                    {r.cuisine} · {r.city}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#fc8019" }}>
                    ⭐ {r.rating}
                  </div>
                </div>
                <span
                  className={`badge ${r.active ? "bg-success" : "bg-secondary"}`}
                  style={{ fontSize: "0.72rem" }}
                >
                  {r.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  /* ── Food Items ──────────────────────────────────────────────────────────── */
  const renderFoodItems = () => {
    const handleAdd = (e) => {
      e.preventDefault();
      if (
        !foodForm.name.trim() ||
        !foodForm.price ||
        !foodForm.category.trim() ||
        !foodForm.restaurantId
      ) {
        setFoodErr("Name, price, category and restaurant are required.");
        return;
      }
      setFoodItems((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: foodForm.name.trim(),
          price: parseFloat(foodForm.price),
          category: foodForm.category.trim(),
          veg: foodForm.veg,
          restaurantId: parseInt(foodForm.restaurantId),
          icon: foodForm.icon || "🍽️",
        },
      ]);
      setFoodForm(emptyFood);
      setFoodErr("");
    };

    return (
      <>
        <h5 className="fw-bold mb-4" style={{ color: "#3d4152" }}>
          🍽️ Food Items
        </h5>

        {/* Add food item form */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3" style={{ color: "#3d4152" }}>
            ➕ Add New Food Item
          </h6>
          {foodErr && (
            <div
              className="alert alert-danger py-2 mb-3"
              style={{ fontSize: "0.85rem" }}
            >
              {foodErr}
            </div>
          )}
          <form onSubmit={handleAdd}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Item Name *
                </label>
                <input
                  className="form-control"
                  placeholder="e.g. Paneer Tikka"
                  value={foodForm.name}
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, name: e.target.value })
                  }
                />
              </div>
              <div className="col-6 col-md-3">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Price (₹) *
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 250"
                  min="1"
                  value={foodForm.price}
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, price: e.target.value })
                  }
                />
              </div>
              <div className="col-6 col-md-3">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Icon (emoji)
                </label>
                <input
                  className="form-control"
                  placeholder="🍽️"
                  value={foodForm.icon}
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, icon: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Category *
                </label>
                <input
                  className="form-control"
                  placeholder="e.g. Starters"
                  value={foodForm.category}
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, category: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Restaurant *
                </label>
                <select
                  className="form-select"
                  value={foodForm.restaurantId}
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, restaurantId: e.target.value })
                  }
                >
                  <option value="">-- Select Restaurant --</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label
                  className="form-label fw-semibold d-block"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Type
                </label>
                <div className="d-flex gap-4">
                  {[
                    { val: true, label: "🟢 Veg", cls: "text-success" },
                    { val: false, label: "🔴 Non-Veg", cls: "text-danger" },
                  ].map((opt) => (
                    <div className="form-check" key={String(opt.val)}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`veg-${opt.val}`}
                        checked={foodForm.veg === opt.val}
                        onChange={() =>
                          setFoodForm({ ...foodForm, veg: opt.val })
                        }
                      />
                      <label
                        className={`form-check-label fw-semibold ${opt.cls}`}
                        htmlFor={`veg-${opt.val}`}
                        style={{ fontSize: "0.85rem" }}
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <button
                  type="submit"
                  className="btn fw-bold px-4"
                  style={{
                    background: "#fc8019",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Add Food Item
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Food item cards */}
        <div className="row g-3">
          {foodItems.map((f) => {
            const rest = restaurants.find((r) => r.id === f.restaurantId);
            return (
              <div className="col-12 col-md-6" key={f.id}>
                <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 52,
                      height: 52,
                      background: "#fff4ec",
                      fontSize: "1.6rem",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      {/* Swiggy-style veg/non-veg square */}
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          border: `2px solid ${f.veg ? "#16a34a" : "#dc2626"}`,
                          borderRadius: 2,
                          position: "relative",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 1,
                            left: 1,
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: f.veg ? "#16a34a" : "#dc2626",
                          }}
                        />
                      </span>
                      <span
                        className="fw-semibold"
                        style={{ color: "#3d4152", fontSize: "0.9rem" }}
                      >
                        {f.name}
                      </span>
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                      {f.category} · {rest?.name || "—"}
                    </div>
                    <div
                      className="fw-bold mt-1"
                      style={{ color: "#fc8019", fontSize: "0.88rem" }}
                    >
                      ₹{f.price}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* ── Orders ──────────────────────────────────────────────────────────────── */
  const renderOrders = () => {
    const filtered =
      filterStatus === "All"
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    return (
      <>
        <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
          📦 Orders
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
          Advance orders through the delivery pipeline.
        </p>

        {/* Pipeline legend */}
        <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
          <div
            className="d-flex align-items-center gap-2 flex-wrap"
            style={{ fontSize: "0.82rem" }}
          >
            <span className="fw-bold text-muted me-1">Pipeline:</span>
            {STATUS_PIPELINE.map((s, i) => (
              <span key={s} className="d-flex align-items-center gap-1">
                <span className={statusBadge(s)}>{s}</span>
                {i < STATUS_PIPELINE.length - 1 && (
                  <span className="text-muted">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Filter pills */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {["All", ...STATUS_PIPELINE].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="btn btn-sm rounded-pill fw-semibold"
              style={{
                background: filterStatus === s ? "#fc8019" : "#fff",
                color: filterStatus === s ? "#fff" : "#3d4152",
                border: "1.5px solid #fc8019",
                fontSize: "0.8rem",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Order cards */}
        <div className="d-flex flex-column gap-3">
          {filtered.map((o) => {
            const next = nextStatus(o.status);
            return (
              <div key={o.id} className="bg-white rounded-3 shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold" style={{ color: "#3d4152" }}>
                        {o.id}
                      </span>
                      <span className={statusBadge(o.status)}>{o.status}</span>
                    </div>
                    <div
                      className="fw-semibold"
                      style={{ color: "#3d4152", fontSize: "0.9rem" }}
                    >
                      {o.item}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                      👤 {o.customer} &nbsp;·&nbsp; 🏪 {o.restaurant}{" "}
                      &nbsp;·&nbsp; 📅 {o.date}
                    </div>
                  </div>
                  <div className="text-end">
                    <div
                      className="fw-bold fs-5 mb-2"
                      style={{ color: "#3d4152" }}
                    >
                      ₹{o.amount}
                    </div>
                    {next ? (
                      <button
                        className="btn btn-sm fw-bold"
                        style={{
                          background: "#fc8019",
                          color: "#fff",
                          border: "none",
                          fontSize: "0.8rem",
                        }}
                        onClick={() => advanceStatus(o.id)}
                      >
                        Mark as {next} →
                      </button>
                    ) : (
                      <span className="badge bg-success px-3 py-2">
                        ✅ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: "3rem" }}>📭</div>
              <p className="mt-2">No orders with status "{filterStatus}"</p>
            </div>
          )}
        </div>
      </>
    );
  };

  /* ── Section switcher ────────────────────────────────────────────────────── */
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfile();
      case "analytics":
        return renderAnalytics();
      case "restaurants":
        return renderRestaurants();
      case "fooditems":
        return renderFoodItems();
      case "orders":
        return renderOrders();
      default:
        return renderProfile();
    }
  };

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER — classic Bootstrap profile layout:
       LEFT  : profile card with nav pills (col-md-3)
       RIGHT : content panel               (col-md-9)
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: "#f0ebe1", minHeight: "100vh" }}>
      {/* ── Sticky topbar ── */}
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
        <span
          className="fw-bold fs-4"
          style={{ color: "#fc8019", letterSpacing: "-0.5px" }}
        >
          🍔 FoodieExpress
          <span
            className="badge ms-2"
            style={{
              background: "#fc8019",
              fontSize: "0.6rem",
              verticalAlign: "middle",
            }}
          >
            OWNER
          </span>
        </span>
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

      {/* ── Main two-column layout ── */}
      <div className="container-lg py-4">
        <div className="row g-4">
          {/* ── LEFT: Profile nav card (col-md-3) ── */}
          <div className="col-md-3">
            <div className="bg-white rounded-3 shadow-sm overflow-hidden">
              {/* User heading with avatar */}
              <div
                className="text-center py-4 px-3"
                style={{
                  background: "linear-gradient(135deg,#fc8019,#fb6a00)",
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mx-auto mb-3"
                  style={{
                    width: 80,
                    height: 80,
                    background: "rgba(255,255,255,0.25)",
                    fontSize: "2rem",
                    border: "3px solid rgba(255,255,255,0.6)",
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
                <h5 className="text-white fw-bold mb-0">{username}</h5>
                <p
                  className="text-white opacity-75 mb-0"
                  style={{ fontSize: "0.8rem" }}
                >
                  Restaurant Owner
                </p>
              </div>

              {/* Nav pills */}
              <ul className="nav flex-column p-2">
                {navPills.map((n) => (
                  <li className="nav-item" key={n.key}>
                    <button
                      className={`nav-link d-flex align-items-center gap-2 w-100 text-start rounded-2 py-2 px-3 mb-1 border-0 fw-semibold`}
                      style={{
                        background:
                          activeSection === n.key ? "#fff4ec" : "transparent",
                        color: activeSection === n.key ? "#fc8019" : "#3d4152",
                        fontSize: "0.88rem",
                      }}
                      onClick={() => setActiveSection(n.key)}
                    >
                      <i className={n.icon} style={{ width: 18 }} />
                      {n.label}
                      {/* Badge for orders count on Orders pill */}
                      {n.key === "orders" &&
                        orders.filter((o) => o.status === "Pending").length >
                          0 && (
                          <span
                            className="badge ms-auto"
                            style={{
                              background: "#fc8019",
                              fontSize: "0.68rem",
                            }}
                          >
                            {
                              orders.filter((o) => o.status === "Pending")
                                .length
                            }
                          </span>
                        )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── RIGHT: Content panel (col-md-9) ── */}
          <div className="col-md-9">{renderContent()}</div>
        </div>
      </div>

      {/* ── Logout confirmation modal ── */}
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
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Confirm Logout</h5>
              </div>
              <div className="modal-body text-center py-4">
                <div style={{ fontSize: "3rem" }}>🍔</div>
                <p className="mt-3 text-muted">
                  Are you sure you want to logout from{" "}
                  <strong>FoodieExpress</strong>?
                </p>
              </div>
              <div className="modal-footer border-0 pt-0 justify-content-center gap-3">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
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

export default OwnerDashboard;
