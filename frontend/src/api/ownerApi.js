import api from "./axiosInstance";

/**
 * GET /owner/restaurants
 * Fetches all restaurants owned by the current owner.
 */
export const getRestaurantsApi = () => api.get("/owner/restaurants");

/**
 * POST /owner/restaurant
 * Creates a new restaurant owned by current owner.
 */
export const createRestaurantApi = (payload) =>
  api.post("/owner/restaurant", payload);

/**
 * GET /owner/menu/{restaurantId}
 * Fetches menu items for a specific restaurant.
 */
export const getMenuByRestaurantApi = (restaurantId) =>
  api.get(`/owner/menu/${restaurantId}`);

/**
 * POST /owner/menu
 * Creates a new menu item under owner's restaurant.
 */
export const createMenuItemApi = (payload) => api.post("/owner/menu", payload);
