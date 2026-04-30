import api from "./axiosInstance";

/**
 * POST /owner/restaurant
 * Creates a new restaurant owned by current owner.
 */
export const createRestaurantApi = (payload) =>
  api.post("/owner/restaurant", payload);

/**
 * POST /owner/menu
 * Creates a new menu item under owner's restaurant.
 */
export const createMenuItemApi = (payload) => api.post("/owner/menu", payload);
