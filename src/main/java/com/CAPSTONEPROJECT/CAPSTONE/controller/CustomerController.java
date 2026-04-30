package com.CAPSTONEPROJECT.CAPSTONE.controller;

import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantDetailsDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CustomerController - Handles restaurant browsing and discovery for customers
 * 
 * Security: All endpoints require CUSTOMER role (configured in SecurityConfig)
 * 
 * Epic 2: Customer Features - User Story 2.1
 * Browse restaurants by location, cuisine, or name
 * 
 * Endpoints:
 * - GET /customer/restaurants - Get all restaurants
 * - GET /customer/restaurants/search - Search with filters (name, location, cuisine)
 * - GET /customer/restaurants/filters - Get available filter options
 * - GET /customer/restaurant/{id} - Get restaurant details
 * - GET /customer/menu/{restaurantId} - Get menu items for a restaurant
 */
@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CustomerController {

    private final RestaurantService restaurantService;

    /**
     * Get all restaurants (no filters)
     * Results include: name, cuisine, rating, location
     */
    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantResponseDTO>> getAllRestaurants() {
        List<RestaurantResponseDTO> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    /**
     * OPTIMIZED SEARCH: Search restaurants by name, location, and cuisine
     * 
     * Query Parameters (all optional):
     * - name: Search by restaurant name (partial match, case-insensitive)
     * - location: Filter by location/city (partial match, case-insensitive)
     * - cuisine: Filter by cuisine type (partial match, case-insensitive)
     *            Searches in both restaurant cuisine and food cuisines
     * 
     * Features:
     * - Uses DISTINCT to avoid duplicates when joining with foods
     * - Case-insensitive search
     * - Partial matching (contains)
     * - Results ordered by rating (highest first)
     * 
     * Example: GET /customer/restaurants/search?name=Pizza&location=Mumbai&cuisine=Italian
     */
    @GetMapping("/restaurants/search")
    public ResponseEntity<List<RestaurantResponseDTO>> searchRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String cuisine) {
        
        List<RestaurantResponseDTO> restaurants = restaurantService.search(name, location, cuisine);
        return ResponseEntity.ok(restaurants);
    }

    /**
     * Get available filter options for the search bar
     * Returns distinct cuisines and locations for dropdown filters
     */
    @GetMapping("/restaurants/filters")
    public ResponseEntity<FilterOptionsDTO> getFilterOptions() {
        List<String> cuisines = restaurantService.getAllCuisines();
        List<String> locations = restaurantService.getAllLocations();
        List<String> cities = restaurantService.getAllCities();
        
        return ResponseEntity.ok(new FilterOptionsDTO(cuisines, locations, cities));
    }

    /**
     * Get top rated restaurants
     */
    @GetMapping("/restaurants/top-rated")
    public ResponseEntity<List<RestaurantResponseDTO>> getTopRatedRestaurants() {
        List<RestaurantResponseDTO> restaurants = restaurantService.getTopRatedRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    /**
     * Get restaurants by city (location filter)
     */
    @GetMapping("/restaurants/city/{city}")
    public ResponseEntity<List<RestaurantResponseDTO>> getRestaurantsByCity(@PathVariable String city) {
        List<RestaurantResponseDTO> restaurants = restaurantService.getRestaurantsByCity(city);
        return ResponseEntity.ok(restaurants);
    }

    /**
     * Get restaurants by location
     */
    @GetMapping("/restaurants/location/{location}")
    public ResponseEntity<List<RestaurantResponseDTO>> getRestaurantsByLocation(@PathVariable String location) {
        List<RestaurantResponseDTO> restaurants = restaurantService.getRestaurantsByLocation(location);
        return ResponseEntity.ok(restaurants);
    }

    /**
     * Get restaurants by cuisine type
     */
    @GetMapping("/restaurants/cuisine/{cuisine}")
    public ResponseEntity<List<RestaurantResponseDTO>> getRestaurantsByCuisine(@PathVariable String cuisine) {
        List<RestaurantResponseDTO> restaurants = restaurantService.getRestaurantsByCuisine(cuisine);
        return ResponseEntity.ok(restaurants);
    }

    /**
     * Get restaurant by ID
     */
    @GetMapping("/restaurant/{id}")
    public ResponseEntity<RestaurantResponseDTO> getRestaurantById(@PathVariable Long id) {
        RestaurantResponseDTO restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }

    /**
     * Get restaurant details with all food items
     * Customer clicks on a restaurant → view menu with foods
     */
    @GetMapping("/restaurants/{id}/details")
    public ResponseEntity<RestaurantDetailsDTO> getRestaurantDetails(@PathVariable Long id) {
        RestaurantDetailsDTO details = restaurantService.getRestaurantDetails(id);
        return ResponseEntity.ok(details);
    }

    /**
     * Get menu items for a restaurant (only available items)
     */
    @GetMapping("/menu/{restaurantId}")
    public ResponseEntity<List<MenuItemResponseDTO>> getMenuByRestaurant(
            @PathVariable Long restaurantId) {
        
        List<MenuItemResponseDTO> menuItems = restaurantService.getMenuByRestaurant(restaurantId);
        return ResponseEntity.ok(menuItems);
    }

    /**
     * DTO for filter options response
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class FilterOptionsDTO {
        private List<String> cuisines;
        private List<String> locations;
        private List<String> cities;
    }
}

