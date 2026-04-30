import api from "./axiosInstance";

/**
 * GET /customer/restaurants
 * Fetches all visible restaurants for customer dashboard.
 */
export const getRestaurantsApi = () => api.get("/customer/restaurants");

/**
 * GET /customer/restaurants/search
 * OPTIMIZED SEARCH: Search restaurants with optional filters
 *
 * Query Parameters (all optional):
 * - name: Restaurant name (partial match, case-insensitive)
 * - location: Location/city (partial match, case-insensitive)
 * - cuisine: Cuisine type (searches in both restaurant and foods)
 *
 * Results ordered by rating (highest first)
 *
 * @param {Object} filters - { name, location, cuisine }
 * @returns Promise with search results
 */
export const searchRestaurantsApi = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.name) params.append("name", filters.name);
  if (filters.location) params.append("location", filters.location);
  if (filters.cuisine) params.append("cuisine", filters.cuisine);
  // Support legacy 'city' parameter
  if (filters.city) params.append("location", filters.city);

  return api.get(`/customer/restaurants/search?${params.toString()}`);
};

/**
 * GET /customer/restaurants/filters
 * Get available filter options (cuisines, locations, cities) for dropdowns
 */
export const getFilterOptionsApi = () => api.get("/customer/restaurants/filters");

/**
 * GET /customer/restaurants/top-rated
 * Get top rated restaurants
 */
export const getTopRatedRestaurantsApi = () => api.get("/customer/restaurants/top-rated");

/**
 * GET /customer/restaurants/city/{city}
 * Get restaurants filtered by city/location
 */
export const getRestaurantsByCityApi = (city) =>
  api.get(`/customer/restaurants/city/${encodeURIComponent(city)}`);

/**
 * GET /customer/restaurants/location/{location}
 * Get restaurants filtered by location
 */
export const getRestaurantsByLocationApi = (location) =>
  api.get(`/customer/restaurants/location/${encodeURIComponent(location)}`);

/**
 * GET /customer/restaurants/cuisine/{cuisine}
 * Get restaurants filtered by cuisine type
 */
export const getRestaurantsByCuisineApi = (cuisine) =>
  api.get(`/customer/restaurants/cuisine/${encodeURIComponent(cuisine)}`);

/**
 * GET /customer/restaurant/{id}
 * Get restaurant details by ID
 */
export const getRestaurantByIdApi = (id) => api.get(`/customer/restaurant/${id}`);

/**
 * GET /customer/restaurants/{id}/details
 * Get restaurant details with all food items
 * Use this when user clicks on a restaurant to view the menu
 */
export const getRestaurantDetailsApi = (id) => api.get(`/customer/restaurants/${id}/details`);

/**
 * GET /customer/menu/{id}
 * Fetches menu for a specific restaurant.
 */
export const getMenuByRestaurantApi = (restaurantId) =>
  api.get(`/customer/menu/${restaurantId}`);

// ============ CART APIs ============

/**
 * POST /customer/cart/add
 * Add item to cart
 * @param {{ foodId: number, quantity: number }} item
 */
export const addToCartApi = (item) => api.post("/customer/cart/add", item);

/**
 * GET /customer/cart
 * Get current cart items
 */
export const getCartApi = () => api.get("/customer/cart");

/**
 * DELETE /customer/cart/{id}
 * Remove item from cart
 */
export const removeFromCartApi = (itemId) => api.delete(`/customer/cart/${itemId}`);

/**
 * PUT /customer/cart/{id}
 * Update cart item quantity
 */
export const updateCartItemApi = (itemId, quantity) => 
  api.put(`/customer/cart/${itemId}`, { quantity });

/**
 * DELETE /customer/cart
 * Clear entire cart
 */
export const clearCartApi = () => api.delete("/customer/cart");

// ============ ORDER APIs ============

/**
 * POST /customer/order/place
 * Place order from cart
 */
export const placeOrderApi = () => api.post("/customer/order/place");

/**
 * GET /customer/order/{id}
 * Get order details and tracking status
 */
export const getOrderByIdApi = (orderId) => api.get(`/customer/order/${orderId}`);

/**
 * GET /customer/orders
 * Get order history
 */
export const getOrderHistoryApi = () => api.get("/customer/orders");

/**
 * GET /customer/orders/search
 * Search orders by date
 */
export const searchOrdersApi = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  return api.get(`/customer/orders/search?${params.toString()}`);
};

// ============ PREFERENCES APIs ============

/**
 * GET /customer/preferences
 * Get customer preferences (favorite restaurants, cuisines)
 */
export const getPreferencesApi = () => api.get("/customer/preferences");

/**
 * POST /customer/preferences
 * Save customer preferences
 * @param {{ favoriteRestaurants: number[], favoriteCuisines: string[] }} prefs
 */
export const savePreferencesApi = (prefs) => api.post("/customer/preferences", prefs);
