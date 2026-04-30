import api from "./axiosInstance";

/**
 * GET /customer/restaurants
 * Fetches all visible restaurants for customer dashboard.
 */
export const getRestaurantsApi = () => api.get("/customer/restaurants");

/**
 * GET /customer/menu/{id}
 * Fetches menu for a specific restaurant.
 */
export const getMenuByRestaurantApi = (restaurantId) =>
  api.get(`/customer/menu/${restaurantId}`);
