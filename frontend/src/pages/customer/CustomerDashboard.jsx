import { useEffect, useState } from "react";
import {
  getMenuByRestaurantApi,
  getRestaurantsApi,
} from "../../api/customerApi";
import AppToast from "../../components/ui/AppToast";

/**
 * CustomerDashboard
 * Dynamic data only:
 * - restaurants: GET /customer/restaurants
 * - menu: GET /customer/menu/{id}
 */
const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const fetchRestaurants = async () => {
    setLoadingRestaurants(true);
    try {
      const { data } = await getRestaurantsApi();
      const list = Array.isArray(data) ? data : data?.data || [];
      setRestaurants(list);

      if (list.length > 0) {
        const defaultId = String(list[0].id ?? list[0].restaurantId ?? "");
        setSelectedRestaurantId(defaultId);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to load restaurants";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchMenu = async (restaurantId) => {
    if (!restaurantId) return;
    setLoadingMenu(true);
    try {
      const { data } = await getMenuByRestaurantApi(restaurantId);
      const list = Array.isArray(data) ? data : data?.data || [];
      setMenuItems(list);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to load menu";
      setToast({ show: true, message: String(msg), type: "error" });
      setMenuItems([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchMenu(selectedRestaurantId);
  }, [selectedRestaurantId]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", padding: "1rem" }}>
      <AppToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h3 style={{ color: "#fc8019", fontWeight: 800, marginBottom: 6 }}>
          Customer Dashboard
        </h3>
        <p style={{ color: "#686b78", marginTop: 0 }}>
          Browse restaurants and menu items
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 4px 18px rgba(0,0,0,.06)",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: ".85rem",
              fontWeight: 600,
              color: "#3d4152",
            }}
          >
            Select Restaurant
          </label>
          <select
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            disabled={loadingRestaurants || restaurants.length === 0}
            style={{
              width: "100%",
              maxWidth: 380,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1.5px solid #d1d5db",
            }}
          >
            {restaurants.map((r) => {
              const id = r.id ?? r.restaurantId;
              const name = r.name ?? r.restaurantName ?? "Restaurant";
              return (
                <option key={id} value={String(id)}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        <h5 style={{ color: "#3d4152", fontWeight: 700, marginBottom: 10 }}>
          Restaurants
        </h5>
        {loadingRestaurants ? (
          <p style={{ color: "#686b78" }}>Loading restaurants...</p>
        ) : (
          <div className="row g-3" style={{ marginBottom: "1rem" }}>
            {restaurants.map((r) => {
              const id = r.id ?? r.restaurantId;
              return (
                <div className="col-12 col-md-6 col-lg-4" key={id}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "1rem",
                      boxShadow: "0 4px 18px rgba(0,0,0,.06)",
                      border:
                        selectedRestaurantId === String(id)
                          ? "1.5px solid #fc8019"
                          : "1.5px solid transparent",
                    }}
                  >
                    <h6
                      style={{ margin: 0, color: "#3d4152", fontWeight: 700 }}
                    >
                      {r.name ?? r.restaurantName ?? "Restaurant"}
                    </h6>
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#686b78",
                        fontSize: ".85rem",
                      }}
                    >
                      {r.cuisine ?? r.category ?? "Food"}
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#686b78",
                        fontSize: ".85rem",
                      }}
                    >
                      {r.city ?? r.address ?? ""}
                    </p>
                  </div>
                </div>
              );
            })}
            {restaurants.length === 0 && (
              <p style={{ color: "#686b78" }}>No restaurants available.</p>
            )}
          </div>
        )}

        <h5 style={{ color: "#3d4152", fontWeight: 700, marginBottom: 10 }}>
          Menu
        </h5>
        {loadingMenu ? (
          <p style={{ color: "#686b78" }}>Loading menu...</p>
        ) : (
          <div className="row g-3">
            {menuItems.map((item) => {
              const id = item.id ?? item.menuId;
              return (
                <div className="col-12 col-md-6 col-lg-4" key={id}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "1rem",
                      boxShadow: "0 4px 18px rgba(0,0,0,.06)",
                    }}
                  >
                    <h6
                      style={{ margin: 0, color: "#3d4152", fontWeight: 700 }}
                    >
                      {item.name ?? item.itemName ?? "Menu item"}
                    </h6>
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#686b78",
                        fontSize: ".85rem",
                      }}
                    >
                      ₹{item.price ?? item.amount ?? 0}
                    </p>
                    <span
                      style={{
                        marginTop: 8,
                        display: "inline-block",
                        fontSize: ".8rem",
                        fontWeight: 700,
                        color: item.available === false ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {item.available === false ? "Unavailable" : "Available"}
                    </span>
                  </div>
                </div>
              );
            })}
            {menuItems.length === 0 && (
              <p style={{ color: "#686b78" }}>
                No menu items found for this restaurant.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
