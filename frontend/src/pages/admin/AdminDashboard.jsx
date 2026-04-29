import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Bootstrap CSS is imported globally in index.js

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AdminDashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Role-protected page for ADMIN users.
 * Styled with Bootstrap 5 utility classes + Swiggy-inspired orange theme.
 *
 * Tabs:
 *   📊 Overview      – summary stats + recent activity
 *   🏪 Restaurants   – add / view restaurants
 *   🍽️ Food Items    – add food items to a restaurant
 *   📦 Orders        – view all orders + change status
 *   👤 Profile       – admin account info
 *
 * Key features:
 *   • Add restaurant form (name, city, cuisine, rating)
 *   • Add food item form (name, price, category, veg flag, restaurant)
 *   • Order status pipeline: Pending → Preparing → Out for Delivery → Completed
 *   • Logout with confirmation modal
 * ─────────────────────────────────────────────────────────────────────────────
 */
const AdminDashboard = () => {
  /* ── Router & auth ──────────────────────────────────────────────────────── */
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  /* ── UI state ───────────────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /* ── Restaurants state ──────────────────────────────────────────────────── */
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
      active: true,
    },
    {
      id: 4,
      name: "South Tadka",
      city: "Chennai",
      cuisine: "South Indian",
      rating: 4.4,
      active: false,
    },
  ]);

  const emptyRestaurant = { name: "", city: "", cuisine: "", rating: "" };
  const [restForm, setRestForm] = useState(emptyRestaurant);
  const [restFormErr, setRestFormErr] = useState("");

  /* ── Food items state ───────────────────────────────────────────────────── */
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
      name: "Masala Dosa",
      price: 120,
      category: "South Indian",
      veg: true,
      restaurantId: 4,
      icon: "🥘",
    },
    {
      id: 5,
      name: "Grilled Chicken",
      price: 320,
      category: "Starters",
      veg: false,
      restaurantId: 2,
      icon: "🍗",
    },
    {
      id: 6,
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
  const [foodFormErr, setFoodFormErr] = useState("");

  /* ── Orders state ───────────────────────────────────────────────────────── */
  /**
   * Status pipeline: Pending → Preparing → Out for Delivery → Completed
   * Admin can advance each order through the pipeline.
   */
  const STATUS_FLOW = ["Pending", "Preparing", "Out for Delivery", "Completed"];

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
      item: "Masala Dosa + Filter Coffee",
      restaurant: "South Tadka",
      amount: 180,
      date: "2026-04-29",
      status: "Pending",
    },
    {
      id: "#ORD-005",
      customer: "Eva",
      item: "Grilled Chicken Platter",
      restaurant: "Biryani House",
      amount: 320,
      date: "2026-04-29",
      status: "Pending",
    },
    {
      id: "#ORD-006",
      customer: "Frank",
      item: "Veg Thali (Full)",
      restaurant: "Spice Garden",
      amount: 210,
      date: "2026-04-29",
      status: "Preparing",
    },
    {
      id: "#ORD-007",
      customer: "Grace",
      item: "Butter Chicken + Garlic Naan × 2",
      restaurant: "Spice Garden",
      amount: 520,
      date: "2026-04-29",
      status: "Out for Delivery",
    },
    {
      id: "#ORD-008",
      customer: "Henry",
      item: "Hyderabadi Chicken Biryani",
      restaurant: "Biryani House",
      amount: 310,
      date: "2026-04-29",
      status: "Completed",
    },
    {
      id: "#ORD-009",
      customer: "Isla",
      item: "Farmhouse Pizza + Coke",
      restaurant: "Pizza Palace",
      amount: 480,
      date: "2026-04-29",
      status: "Pending",
    },
    {
      id: "#ORD-010",
      customer: "Jake",
      item: "Idli Sambar × 2 + Vada",
      restaurant: "South Tadka",
      amount: 140,
      date: "2026-04-29",
      status: "Out for Delivery",
    },
    {
      id: "#ORD-011",
      customer: "Kira",
      item: "Paneer Tikka + Jeera Rice",
      restaurant: "Spice Garden",
      amount: 390,
      date: "2026-04-29",
      status: "Preparing",
    },
    {
      id: "#ORD-012",
      customer: "Leo",
      item: "Mutton Rogan Josh + Roomali Roti",
      restaurant: "Biryani House",
      amount: 560,
      date: "2026-04-29",
      status: "Completed",
    },
  ]);

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  /** Advance an order to the next status in the pipeline */
  const advanceStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = STATUS_FLOW.indexOf(o.status);
        if (idx === STATUS_FLOW.length - 1) return o; // already Completed
        return { ...o, status: STATUS_FLOW[idx + 1] };
      }),
    );
  };

  /** Bootstrap badge class for order status */
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

  /** Next status label for the advance button */
  const nextStatus = (status) => {
    const idx = STATUS_FLOW.indexOf(status);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  /** Logout — clears localStorage and redirects */
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  /* ── Summary stats for overview ─────────────────────────────────────────── */
  const stats = [
    {
      label: "Restaurants",
      value: restaurants.length,
      icon: "🏪",
      color: "border-warning",
    },
    {
      label: "Food Items",
      value: foodItems.length,
      icon: "🍽️",
      color: "border-info",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "📦",
      color: "border-primary",
    },
    {
      label: "Pending Orders",
      value: orders.filter((o) => o.status === "Pending").length,
      icon: "⏳",
      color: "border-danger",
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     SECTION RENDERERS
  ═══════════════════════════════════════════════════════════════════════════ */

  /* ── 1. Overview ─────────────────────────────────────────────────────────── */
  const renderOverview = () => (
    <>
      {/* Hero banner */}
      <div
        className="rounded-3 p-4 mb-4 text-white"
        style={{ background: "linear-gradient(120deg,#fc8019,#fb6a00)" }}
      >
        <h3 className="fw-bold mb-1">Welcome, {username}! 🛠️</h3>
        <p className="mb-0 opacity-75">
          Manage restaurants, food items and orders from one place.
        </p>
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

      {/* Recent orders snapshot */}
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
        {orders.slice(0, 4).map((o, idx) => (
          <div
            key={o.id}
            className={`d-flex align-items-center justify-content-between px-4 py-3 ${idx !== 3 ? "border-bottom" : ""}`}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: "#fff4ec",
                  fontSize: "1.2rem",
                }}
              >
                🍽️
              </div>
              <div>
                <div
                  className="fw-semibold"
                  style={{ color: "#3d4152", fontSize: "0.88rem" }}
                >
                  {o.customer} &mdash; {o.item}
                </div>
                <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                  {o.restaurant} · {o.date}
                </div>
              </div>
            </div>
            <div className="text-end">
              <div
                className="fw-bold mb-1"
                style={{ color: "#3d4152", fontSize: "0.88rem" }}
              >
                ₹{o.amount}
              </div>
              <span
                className={statusBadge(o.status)}
                style={{ fontSize: "0.7rem" }}
              >
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  /* ── 2. Restaurants ──────────────────────────────────────────────────────── */
  const renderRestaurants = () => {
    /** Handle add-restaurant form submit */
    const handleAddRestaurant = (e) => {
      e.preventDefault();
      if (
        !restForm.name.trim() ||
        !restForm.city.trim() ||
        !restForm.cuisine.trim()
      ) {
        setRestFormErr("Name, city and cuisine are required.");
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
      setRestForm(emptyRestaurant);
      setRestFormErr("");
    };

    return (
      <>
        <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
          Restaurants 🏪
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
          Add and manage partner restaurants.
        </p>

        {/* Add restaurant form */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3" style={{ color: "#3d4152" }}>
            ➕ Add New Restaurant
          </h6>
          {restFormErr && (
            <div
              className="alert alert-danger py-2 mb-3"
              style={{ fontSize: "0.85rem" }}
            >
              {restFormErr}
            </div>
          )}
          <form onSubmit={handleAddRestaurant}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Restaurant Name *
                </label>
                <input
                  className="form-control"
                  placeholder="e.g. Spice Garden"
                  value={restForm.name}
                  onChange={(e) =>
                    setRestForm({ ...restForm, name: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  City *
                </label>
                <input
                  className="form-control"
                  placeholder="e.g. Delhi"
                  value={restForm.city}
                  onChange={(e) =>
                    setRestForm({ ...restForm, city: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Cuisine *
                </label>
                <input
                  className="form-control"
                  placeholder="e.g. North Indian"
                  value={restForm.cuisine}
                  onChange={(e) =>
                    setRestForm({ ...restForm, cuisine: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem", color: "#3d4152" }}
                >
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 4.3"
                  min="1"
                  max="5"
                  step="0.1"
                  value={restForm.rating}
                  onChange={(e) =>
                    setRestForm({ ...restForm, rating: e.target.value })
                  }
                />
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
                  Add Restaurant
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Restaurant list */}
        <div className="row g-3">
          {restaurants.map((r) => (
            <div className="col-12 col-md-6" key={r.id}>
              <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
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

  /* ── 3. Food Items ───────────────────────────────────────────────────────── */
  const renderFoodItems = () => {
    /** Handle add-food-item form submit */
    const handleAddFood = (e) => {
      e.preventDefault();
      if (
        !foodForm.name.trim() ||
        !foodForm.price ||
        !foodForm.category.trim() ||
        !foodForm.restaurantId
      ) {
        setFoodFormErr("Name, price, category and restaurant are required.");
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
      setFoodFormErr("");
    };

    return (
      <>
        <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
          Food Items 🍽️
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
          Add food items to any restaurant.
        </p>

        {/* Add food item form */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h6 className="fw-bold mb-3" style={{ color: "#3d4152" }}>
            ➕ Add New Food Item
          </h6>
          {foodFormErr && (
            <div
              className="alert alert-danger py-2 mb-3"
              style={{ fontSize: "0.85rem" }}
            >
              {foodFormErr}
            </div>
          )}
          <form onSubmit={handleAddFood}>
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
                {/* Veg / Non-veg toggle */}
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="fw-semibold"
                    style={{ fontSize: "0.85rem", color: "#3d4152" }}
                  >
                    Type:
                  </span>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="veg"
                      checked={foodForm.veg === true}
                      onChange={() => setFoodForm({ ...foodForm, veg: true })}
                    />
                    <label
                      className="form-check-label text-success fw-semibold"
                      htmlFor="veg"
                      style={{ fontSize: "0.85rem" }}
                    >
                      🟢 Veg
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="nonveg"
                      checked={foodForm.veg === false}
                      onChange={() => setFoodForm({ ...foodForm, veg: false })}
                    />
                    <label
                      className="form-check-label text-danger fw-semibold"
                      htmlFor="nonveg"
                      style={{ fontSize: "0.85rem" }}
                    >
                      🔴 Non-Veg
                    </label>
                  </div>
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

        {/* Food items list */}
        <div className="row g-3">
          {foodItems.map((f) => {
            const restaurant = restaurants.find((r) => r.id === f.restaurantId);
            return (
              <div className="col-12 col-md-6" key={f.id}>
                <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3">
                  {/* Food emoji */}
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
                    {/* Veg/Non-veg square dot (Swiggy style) */}
                    <div className="d-flex align-items-center gap-2 mb-1">
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
                      {f.category} · {restaurant?.name || "Unknown"}
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

  /* ── 4. Orders ───────────────────────────────────────────────────────────── */
  const renderOrders = () => {
    /** Filter tabs for orders */
    const [filterStatus, setFilterStatus] = useState("All");
    const filtered =
      filterStatus === "All"
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    return (
      <>
        <h5 className="fw-bold mb-1" style={{ color: "#3d4152" }}>
          Orders 📦
        </h5>
        <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
          Manage and update order statuses through the pipeline.
        </p>

        {/* Status pipeline legend */}
        <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
          <div
            className="d-flex align-items-center gap-2 flex-wrap"
            style={{ fontSize: "0.82rem", color: "#3d4152" }}
          >
            <span className="fw-bold me-1">Pipeline:</span>
            {STATUS_FLOW.map((s, i) => (
              <span key={s} className="d-flex align-items-center gap-1">
                <span className={statusBadge(s)}>{s}</span>
                {i < STATUS_FLOW.length - 1 && (
                  <span className="text-muted">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Filter pills */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {["All", ...STATUS_FLOW].map((s) => (
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
                  {/* Left: order info */}
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
                  {/* Right: amount + action */}
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

  /* ── 5. Profile ──────────────────────────────────────────────────────────── */
  const renderProfile = () => (
    <>
      <h5 className="fw-bold mb-4" style={{ color: "#3d4152" }}>
        Admin Profile 👤
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
              Admin
            </span>
          </div>
        </div>

        {/* Detail rows */}
        {[
          { label: "Username", value: username },
          { label: "Role", value: "Admin" },
          { label: "Restaurants", value: restaurants.length },
          { label: "Food Items", value: foodItems.length },
          { label: "Total Orders", value: orders.length },
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
    </>
  );

  /* ── Section switcher ────────────────────────────────────────────────────── */
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "restaurants":
        return renderRestaurants();
      case "fooditems":
        return renderFoodItems();
      case "orders":
        return renderOrders();
      case "profile":
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  /* Navigation tabs */
  const navItems = [
    { key: "overview", label: "📊 Overview" },
    { key: "restaurants", label: "🏪 Restaurants" },
    { key: "fooditems", label: "🍽️ Food Items" },
    { key: "orders", label: "📦 Orders" },
    { key: "profile", label: "👤 Profile" },
  ];

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: "#f0ebe1", minHeight: "100vh" }}>
      {/* ── Sticky Topbar ── */}
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
          🍔 FoodieExpress{" "}
          <span
            className="badge ms-2"
            style={{
              background: "#fc8019",
              fontSize: "0.6rem",
              verticalAlign: "middle",
            }}
          >
            ADMIN
          </span>
        </span>

        {/* User + logout */}
        <div className="d-flex align-items-center gap-3">
          <span
            className="fw-semibold d-none d-md-inline"
            style={{ color: "#3d4152", fontSize: "0.9rem" }}
          >
            🛠️ {username}
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

      {/* ── Horizontal tab strip ── */}
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

      {/* ── Main content ── */}
      <div className="container-lg py-4">{renderContent()}</div>

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
                <div style={{ fontSize: "3rem" }}>🛠️</div>
                <p className="mt-3 text-muted">
                  Are you sure you want to logout from{" "}
                  <strong>FoodieExpress Admin</strong>?
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

export default AdminDashboard;
