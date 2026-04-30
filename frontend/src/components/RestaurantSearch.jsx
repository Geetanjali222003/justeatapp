import React, { useState, useEffect } from "react";
import { searchRestaurantsApi, getFilterOptionsApi } from "../api/customerApi";

/**
 * RestaurantSearch Component
 *
 * Epic 2: Customer Features - User Story 2.1
 * Browse restaurants by location, cuisine, or name
 *
 * Features:
 * - Search bar for restaurant name
 * - Dropdown filters for cuisine and location
 * - Results show restaurant name, cuisine, rating
 * - Real-time search as user types
 * - Optimized query using DISTINCT and JOIN with foods
 */
const RestaurantSearch = ({ onRestaurantSelect }) => {
  // Search/filter state
  const [searchName, setSearchName] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Filter options from API
  const [cuisines, setCuisines] = useState([]);
  const [locations, setLocations] = useState([]);

  // Results
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
    // Initial load - all restaurants
    handleSearch();
  }, []);

  // Debounced search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchName, selectedCuisine, selectedLocation]);

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptionsApi();
      setCuisines(response.data.cuisines || []);
      // Use locations first, fall back to cities
      setLocations(response.data.locations || response.data.cities || []);
    } catch (err) {
      console.error("Failed to load filter options:", err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const filters = {
        name: searchName || undefined,
        cuisine: selectedCuisine || undefined,
        location: selectedLocation || undefined,
      };

      const response = await searchRestaurantsApi(filters);
      setRestaurants(response.data || []);
    } catch (err) {
      setError("Failed to search restaurants. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchName("");
    setSelectedCuisine("");
    setSelectedLocation("");
  };

  // Star rating display
  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;

    return (
      <span className="text-warning">
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
        <span className="text-muted ms-1">({numRating.toFixed(1)})</span>
      </span>
    );
  };

  return (
    <div className="restaurant-search">
      {/* Search Bar Section */}
      <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
        <h5 className="fw-bold mb-3" style={{ color: "#3d4152" }}>
          🔍 Find Restaurants
        </h5>

        {/* Search Input */}
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                🔎
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by restaurant name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>

          {/* Cuisine Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="col-12 col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
              disabled={!searchName && !selectedCuisine && !selectedLocation}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchName || selectedCuisine || selectedLocation) && (
          <div className="mt-3 d-flex flex-wrap gap-2">
            {searchName && (
              <span className="badge bg-light text-dark border">
                Name: {searchName}
                <button
                  className="btn-close btn-close-sm ms-1"
                  style={{ fontSize: "0.6rem" }}
                  onClick={() => setSearchName("")}
                />
              </span>
            )}
            {selectedCuisine && (
              <span className="badge bg-light text-dark border">
                Cuisine: {selectedCuisine}
                <button
                  className="btn-close btn-close-sm ms-1"
                  style={{ fontSize: "0.6rem" }}
                  onClick={() => setSelectedCuisine("")}
                />
              </span>
            )}
            {selectedLocation && (
              <span className="badge bg-light text-dark border">
                Location: {selectedLocation}
                <button
                  className="btn-close btn-close-sm ms-1"
                  style={{ fontSize: "0.6rem" }}
                  onClick={() => setSelectedLocation("")}
                />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Searching restaurants...</p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-muted mb-0">
              {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} found
            </h6>
          </div>

          {/* Restaurant Cards */}
          {restaurants.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-3">
              <div style={{ fontSize: "3rem" }}>🍽️</div>
              <p className="text-muted mt-2">No restaurants found. Try different filters.</p>
            </div>
          ) : (
            <div className="row g-3">
              {restaurants.map((restaurant) => (
                <div className="col-12 col-md-6 col-lg-4" key={restaurant.id}>
                  <div
                    className="card h-100 border-0 shadow-sm hover-shadow"
                    style={{ cursor: "pointer", transition: "transform 0.2s" }}
                    onClick={() => onRestaurantSelect && onRestaurantSelect(restaurant)}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    {/* Restaurant Image Placeholder */}
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center"
                      style={{
                        height: "140px",
                        background: "linear-gradient(135deg, #ff6b35, #fc8019)",
                        color: "#fff",
                        fontSize: "3rem",
                      }}
                    >
                      🍴
                    </div>

                    <div className="card-body">
                      {/* Restaurant Name */}
                      <h6 className="card-title fw-bold mb-1" style={{ color: "#3d4152" }}>
                        {restaurant.name}
                      </h6>

                      {/* Cuisine Badge */}
                      <span
                        className="badge mb-2"
                        style={{ background: "#fff4ec", color: "#fc8019" }}
                      >
                        {restaurant.cuisine || "Multi-Cuisine"}
                      </span>

                      {/* Rating */}
                      <div className="mb-2">
                        {renderStars(restaurant.rating)}
                      </div>

                      {/* Location */}
                      <p className="card-text text-muted small mb-0">
                        📍 {restaurant.city || restaurant.address || "Location not specified"}
                      </p>
                    </div>

                    <div className="card-footer bg-white border-0 pt-0">
                      <button
                        className="btn btn-sm w-100"
                        style={{ background: "#fc8019", color: "#fff" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestaurantSelect && onRestaurantSelect(restaurant);
                        }}
                      >
                        View Menu →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantSearch;

