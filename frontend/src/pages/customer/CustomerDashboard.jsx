import { useEffect, useState } from "react";
import {
  getMenuByRestaurantApi,
  getRestaurantsApi,
  getRestaurantDetailsApi,
  searchRestaurantsApi,
} from "../../api/customerApi";
import AppToast from "../../components/ui/AppToast";

/**
 * CustomerDashboard
 * Dynamic data only:
 * - restaurants: GET /customer/restaurants
 * - search: GET /customer/restaurants/search?name=&city=&cuisine=
 * - menu: GET /customer/menu/{id}
 */
const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  // Search filters
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [searching, setSearching] = useState(false);

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

  const searchRestaurants = async () => {
    setSearching(true);
    try {
      const { data } = await searchRestaurantsApi({
        name: name.trim(),
        city: location.trim(),
        cuisine: cuisine.trim(),
      });
      const list = Array.isArray(data) ? data : data?.data || [];
      setRestaurants(list);

      if (list.length > 0) {
        const defaultId = String(list[0].id ?? list[0].restaurantId ?? "");
        setSelectedRestaurantId(defaultId);
      } else {
        setSelectedRestaurantId("");
        setMenuItems([]);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Search failed";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setName("");
    setLocation("");
    setCuisine("");
    fetchRestaurants();
  };

  // Click handler to open restaurant and show its menu
  const openRestaurant = async (restaurant) => {
    const id = String(restaurant.id ?? restaurant.restaurantId ?? "");
    setSelectedRestaurantId(id);
    setSelectedRestaurant(restaurant);

    // Try to fetch full restaurant details with foods
    setLoadingMenu(true);
    try {
      const { data } = await getRestaurantDetailsApi(id);
      if (data) {
        setSelectedRestaurant(data);
        // If foods are included in the response, use them
        if (data.foods && Array.isArray(data.foods)) {
          setMenuItems(data.foods);
        }
      }
    } catch (error) {
      // Fallback to regular menu fetch (already handled by useEffect)
      console.log("Falling back to menu API");
    } finally {
      setLoadingMenu(false);
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

        {/* Search Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 4px 18px rgba(0,0,0,.06)",
          }}
        >
          <h5 style={{ margin: "0 0 12px", color: "#3d4152", fontWeight: 700 }}>
            🔍 Search Restaurants
          </h5>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <input
              type="text"
              placeholder="Search by name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: "1 1 150px",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: 14,
              }}
            />
            <input
              type="text"
              placeholder="Location / City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                flex: "1 1 150px",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: 14,
              }}
            />
            <input
              type="text"
              placeholder="Cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              style={{
                flex: "1 1 150px",
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={searchRestaurants}
              disabled={searching}
              style={{
                padding: "10px 20px",
                background: searching ? "#ccc" : "#fc8019",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: 600,
                cursor: searching ? "not-allowed" : "pointer",
              }}
            >
              {searching ? "Searching..." : "Search"}
            </button>
            <button
              onClick={clearSearch}
              style={{
                padding: "10px 20px",
                background: "#f5f5f5",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: 4,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Restaurant Selector */}
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
                    onClick={() => openRestaurant(r)}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "1rem",
                      boxShadow: "0 4px 18px rgba(0,0,0,.06)",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      border:
                        selectedRestaurantId === String(id)
                          ? "2px solid #fc8019"
                          : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0,0,0,.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 18px rgba(0,0,0,.06)";
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
                      🍽️ {r.cuisine ?? r.category ?? "Food"}
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#686b78",
                        fontSize: ".85rem",
                      }}
                    >
                      📍 {r.city ?? r.location ?? r.address ?? ""}
                    </p>
                    {r.rating !== undefined && r.rating !== null && (
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#fc8019",
                          fontSize: ".85rem",
                          fontWeight: 600,
                        }}
                      >
                        ⭐ {r.rating}
                      </p>
                    )}
                    <p
                      style={{
                        margin: "10px 0 0",
                        color: "#fc8019",
                        fontSize: ".75rem",
                        fontWeight: 600,
                      }}
                    >
                      👆 Click to view menu
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

        {/* Selected Restaurant & Menu */}
        {selectedRestaurant && (
          <div
            style={{
              background: "#fff4ec",
              borderRadius: 12,
              padding: "1rem",
              marginBottom: "1rem",
              border: "1px solid #fcd9b4",
            }}
          >
            <h5 style={{ margin: 0, color: "#fc8019", fontWeight: 700 }}>
              🍽️{" "}
              {selectedRestaurant.name ??
                selectedRestaurant.restaurantName ??
                "Restaurant"}
            </h5>
            <p
              style={{ margin: "6px 0 0", color: "#686b78", fontSize: ".9rem" }}
            >
              📍{" "}
              {selectedRestaurant.city ??
                selectedRestaurant.location ??
                selectedRestaurant.address ??
                ""}
              {selectedRestaurant.cuisine && ` • ${selectedRestaurant.cuisine}`}
              {selectedRestaurant.rating &&
                ` • ⭐ ${selectedRestaurant.rating}`}
            </p>
          </div>
        )}

        <h5 style={{ color: "#3d4152", fontWeight: 700, marginBottom: 10 }}>
          {selectedRestaurant
            ? `Menu - ${selectedRestaurant.name ?? "Restaurant"}`
            : "Menu"}
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
                    {item.description && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#686b78",
                          fontSize: ".8rem",
                          fontStyle: "italic",
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                    {(item.cuisine || item.category) && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#686b78",
                          fontSize: ".8rem",
                        }}
                      >
                        🍽️ {item.cuisine ?? item.category}
                      </p>
                    )}
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#fc8019",
                        fontSize: ".95rem",
                        fontWeight: 700,
                      }}
                    >
                      ₹ {item.price ?? item.amount ?? 0}
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
