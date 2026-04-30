import { useEffect, useState } from "react";
import {
  createMenuItemApi,
  createRestaurantApi,
  getMenuByRestaurantApi,
  getRestaurantsApi,
} from "../../api/ownerApi";
import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import AppToast from "../../components/ui/AppToast";

/**
 * OwnerDashboardV2
 * - Add restaurant: POST /owner/restaurant
 * - Add menu item: POST /owner/menu
 * - Lists are fetched using customer read APIs to avoid hardcoded arrays
 */
const OwnerDashboardV2 = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [creatingRestaurant, setCreatingRestaurant] = useState(false);
  const [creatingMenu, setCreatingMenu] = useState(false);

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    city: "",
    cuisine: "",
  });
  const [menuForm, setMenuForm] = useState({
    restaurantId: "",
    name: "",
    price: "",
    available: true,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const loadRestaurants = async () => {
    setLoadingRestaurants(true);
    try {
      const { data } = await getRestaurantsApi();
      const list = Array.isArray(data) ? data : data?.data || [];
      setRestaurants(list);
      if (list.length > 0) {
        const id = String(list[0].id ?? list[0].restaurantId ?? "");
        setSelectedRestaurantId(id);
        setMenuForm((prev) => ({ ...prev, restaurantId: id }));
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to load restaurants";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const loadMenu = async (restaurantId) => {
    if (!restaurantId) {
      setMenuItems([]);
      return;
    }

    setLoadingMenu(true);
    try {
      const { data } = await getMenuByRestaurantApi(restaurantId);
      const list = Array.isArray(data) ? data : data?.data || [];
      setMenuItems(list);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to load menu items";
      setToast({ show: true, message: String(msg), type: "error" });
      setMenuItems([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    loadMenu(selectedRestaurantId);
  }, [selectedRestaurantId]);

  const submitRestaurant = async (e) => {
    e.preventDefault();
    if (!restaurantForm.name.trim() || !restaurantForm.city.trim()) {
      setToast({
        show: true,
        message: "Restaurant name and city are required",
        type: "error",
      });
      return;
    }

    setCreatingRestaurant(true);
    try {
      /** API call: POST /owner/restaurant */
      await createRestaurantApi({
        name: restaurantForm.name.trim(),
        city: restaurantForm.city.trim(),
        cuisine: restaurantForm.cuisine.trim(),
      });

      setRestaurantForm({ name: "", city: "", cuisine: "" });
      setToast({ show: true, message: "Restaurant added", type: "success" });
      await loadRestaurants();
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add restaurant";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setCreatingRestaurant(false);
    }
  };

  const submitMenu = async (e) => {
    e.preventDefault();
    if (!menuForm.restaurantId || !menuForm.name.trim() || !menuForm.price) {
      setToast({
        show: true,
        message: "Restaurant, item name and price are required",
        type: "error",
      });
      return;
    }

    setCreatingMenu(true);
    try {
      /** API call: POST /owner/menu */
      await createMenuItemApi({
        restaurantId: Number(menuForm.restaurantId),
        name: menuForm.name.trim(),
        price: Number(menuForm.price),
        available: menuForm.available,
      });

      setMenuForm((prev) => ({
        ...prev,
        name: "",
        price: "",
        available: true,
      }));
      setToast({ show: true, message: "Menu item added", type: "success" });
      await loadMenu(menuForm.restaurantId);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add menu item";
      setToast({ show: true, message: String(msg), type: "error" });
    } finally {
      setCreatingMenu(false);
    }
  };

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
          Owner Dashboard
        </h3>
        <p style={{ color: "#686b78", marginTop: 0 }}>
          Manage restaurants and menu items
        </p>

        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "1rem",
                boxShadow: "0 4px 18px rgba(0,0,0,.06)",
              }}
            >
              <h5 style={{ color: "#3d4152", fontWeight: 700 }}>
                Add Restaurant
              </h5>
              <form onSubmit={submitRestaurant}>
                <AppInput
                  id="r-name"
                  label="Restaurant Name"
                  value={restaurantForm.name}
                  onChange={(e) =>
                    setRestaurantForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
                <AppInput
                  id="r-city"
                  label="City"
                  value={restaurantForm.city}
                  onChange={(e) =>
                    setRestaurantForm((p) => ({ ...p, city: e.target.value }))
                  }
                  required
                />
                <AppInput
                  id="r-cuisine"
                  label="Cuisine"
                  value={restaurantForm.cuisine}
                  onChange={(e) =>
                    setRestaurantForm((p) => ({
                      ...p,
                      cuisine: e.target.value,
                    }))
                  }
                />
                <AppButton type="submit" loading={creatingRestaurant} fullWidth>
                  Add Restaurant
                </AppButton>
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "1rem",
                boxShadow: "0 4px 18px rgba(0,0,0,.06)",
              }}
            >
              <h5 style={{ color: "#3d4152", fontWeight: 700 }}>
                Add Menu Item
              </h5>
              <form onSubmit={submitMenu}>
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: ".85rem",
                      fontWeight: 600,
                      color: "#3d4152",
                    }}
                  >
                    Restaurant
                  </label>
                  <select
                    value={menuForm.restaurantId}
                    onChange={(e) => {
                      setMenuForm((p) => ({
                        ...p,
                        restaurantId: e.target.value,
                      }));
                      setSelectedRestaurantId(e.target.value);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1.5px solid #d1d5db",
                    }}
                  >
                    <option value="">Select restaurant</option>
                    {restaurants.map((r) => {
                      const id = r.id ?? r.restaurantId;
                      return (
                        <option key={id} value={String(id)}>
                          {r.name ?? r.restaurantName ?? "Restaurant"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <AppInput
                  id="m-name"
                  label="Item Name"
                  value={menuForm.name}
                  onChange={(e) =>
                    setMenuForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
                <AppInput
                  id="m-price"
                  label="Price"
                  type="number"
                  value={menuForm.price}
                  onChange={(e) =>
                    setMenuForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                />

                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      fontSize: ".9rem",
                      color: "#3d4152",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={menuForm.available}
                      onChange={(e) =>
                        setMenuForm((p) => ({
                          ...p,
                          available: e.target.checked,
                        }))
                      }
                    />
                    Available
                  </label>
                </div>

                <AppButton type="submit" loading={creatingMenu} fullWidth>
                  Add Menu Item
                </AppButton>
              </form>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            background: "#fff",
            borderRadius: 12,
            padding: "1rem",
            boxShadow: "0 4px 18px rgba(0,0,0,.06)",
          }}
        >
          <h5 style={{ color: "#3d4152", fontWeight: 700 }}>Restaurants</h5>
          {loadingRestaurants ? (
            <p style={{ color: "#686b78" }}>Loading restaurants...</p>
          ) : (
            <div className="row g-3">
              {restaurants.map((r) => {
                const id = r.id ?? r.restaurantId;
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={id}>
                    <div
                      onClick={() => {
                        setSelectedRestaurantId(String(id));
                        setMenuForm((p) => ({
                          ...p,
                          restaurantId: String(id),
                        }));
                      }}
                      style={{
                        background: "#fff",
                        borderRadius: 10,
                        border:
                          selectedRestaurantId === String(id)
                            ? "1.5px solid #fc8019"
                            : "1.5px solid #e5e7eb",
                        padding: ".85rem",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#3d4152" }}>
                        {r.name ?? r.restaurantName ?? "Restaurant"}
                      </div>
                      <div style={{ color: "#686b78", fontSize: ".85rem" }}>
                        {r.city ?? r.address ?? ""}
                      </div>
                    </div>
                  </div>
                );
              })}
              {restaurants.length === 0 && (
                <p style={{ color: "#686b78" }}>No restaurants found.</p>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 16,
            background: "#fff",
            borderRadius: 12,
            padding: "1rem",
            boxShadow: "0 4px 18px rgba(0,0,0,.06)",
          }}
        >
          <h5 style={{ color: "#3d4152", fontWeight: 700 }}>Menu Items</h5>
          {loadingMenu ? (
            <p style={{ color: "#686b78" }}>Loading menu...</p>
          ) : (
            <div className="row g-3">
              {menuItems.map((item) => (
                <div
                  className="col-12 col-md-6 col-lg-4"
                  key={item.id ?? item.menuId}
                >
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: ".85rem",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "#3d4152" }}>
                      {item.name ?? item.itemName ?? "Menu item"}
                    </div>
                    <div style={{ color: "#686b78", fontSize: ".85rem" }}>
                      ₹{item.price ?? item.amount ?? 0}
                    </div>
                    <div
                      style={{
                        color: item.available === false ? "#dc2626" : "#16a34a",
                        fontWeight: 700,
                        fontSize: ".8rem",
                        marginTop: 6,
                      }}
                    >
                      {item.available === false ? "Unavailable" : "Available"}
                    </div>
                  </div>
                </div>
              ))}
              {menuItems.length === 0 && (
                <p style={{ color: "#686b78" }}>
                  No menu items for selected restaurant.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardV2;
