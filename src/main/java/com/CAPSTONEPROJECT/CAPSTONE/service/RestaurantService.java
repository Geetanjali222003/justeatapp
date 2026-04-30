package com.CAPSTONEPROJECT.CAPSTONE.service;

import com.CAPSTONEPROJECT.CAPSTONE.dto.FoodDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantDetailsDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.entity.MenuItem;
import com.CAPSTONEPROJECT.CAPSTONE.entity.Restaurant;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.MenuItemRepository;
import com.CAPSTONEPROJECT.CAPSTONE.repository.RestaurantRepository;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    // ==================== RESTAURANT OPERATIONS ====================

    /**
     * Create a new restaurant for the owner
     */
    @Transactional
    public RestaurantResponseDTO createRestaurant(RestaurantRequestDTO request, Long ownerId) {
        // Fetch the owner User object - required for the @ManyToOne relationship
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));
        
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .cuisine(request.getCuisine())
                .phoneNumber(request.getPhoneNumber())
                .owner(owner)  // Set the actual User object, not just the ID
                .build();

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToRestaurantResponse(saved);
    }

    /**
     * Get all restaurants (for customers)
     */
    public List<RestaurantResponseDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get restaurants owned by a specific owner
     */
    public List<RestaurantResponseDTO> getRestaurantsByOwner(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId).stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get restaurant by ID
     */
    public RestaurantResponseDTO getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        return mapToRestaurantResponse(restaurant);
    }

    /**
     * Get restaurant details with all food items
     * Used when customer clicks on a restaurant to view the full menu
     */
    @Transactional(readOnly = true)
    public RestaurantDetailsDTO getRestaurantDetails(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        
        // Map foods to DTOs
        List<FoodDTO> foodDTOs = restaurant.getFoods().stream()
                .map(food -> FoodDTO.builder()
                        .id(food.getId())
                        .name(food.getName())
                        .description(food.getDescription())
                        .cuisine(food.getCuisine())
                        .price(food.getPrice())
                        .category(food.getCategory())
                        .isVeg(food.getIsVeg())
                        .available(food.getAvailable())
                        .build())
                .collect(Collectors.toList());
        
        return RestaurantDetailsDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .location(restaurant.getLocation())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .cuisine(restaurant.getCuisine())
                .phoneNumber(restaurant.getPhoneNumber())
                .rating(restaurant.getRating())
                .active(restaurant.getActive())
                .ownerId(restaurant.getOwnerId())
                .foods(foodDTOs)
                .build();
    }

    // ==================== MENU ITEM OPERATIONS ====================

    /**
     * Create a new menu item for a restaurant
     */
    @Transactional
    public MenuItemResponseDTO createMenuItem(MenuItemRequestDTO request, Long ownerId) {
        // Verify the restaurant belongs to the owner
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + request.getRestaurantId()));

        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You don't have permission to add menu items to this restaurant");
        }

        MenuItem menuItem = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .restaurantId(request.getRestaurantId())
                .build();

        MenuItem saved = menuItemRepository.save(menuItem);
        return mapToMenuItemResponse(saved);
    }

    /**
     * Get menu items for a restaurant (for customers - only available items)
     */
    public List<MenuItemResponseDTO> getMenuByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndAvailableTrue(restaurantId).stream()
                .map(this::mapToMenuItemResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all menu items for a restaurant (for owners - includes unavailable)
     */
    public List<MenuItemResponseDTO> getAllMenuByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToMenuItemResponse)
                .collect(Collectors.toList());
    }

    // ==================== SEARCH & FILTER OPERATIONS ====================

    /**
     * OPTIMIZED SEARCH: Search restaurants by name, location, and cuisine
     * 
     * Features:
     * - Case-insensitive partial matching
     * - Searches cuisine in both restaurant and foods table
     * - Uses DISTINCT to avoid duplicates
     * - Results ordered by rating (highest first)
     * - All parameters are optional (pass null to skip filter)
     * 
     * @param name Restaurant name filter
     * @param location Location/city filter
     * @param cuisine Cuisine type filter (searches in foods too)
     * @return List of matching restaurants as DTOs
     */
    public List<RestaurantResponseDTO> search(String name, String location, String cuisine) {
        // Normalize empty strings to null for the query
        String normalizedName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String normalizedLocation = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        String normalizedCuisine = (cuisine != null && !cuisine.trim().isEmpty()) ? cuisine.trim() : null;
        
        List<Restaurant> restaurants = restaurantRepository.searchRestaurants(
                normalizedName, 
                normalizedLocation, 
                normalizedCuisine
        );
        
        return restaurants.stream()
                .map(this::mapToRestaurantResponseWithCuisine)
                .collect(Collectors.toList());
    }

    /**
     * Search restaurants by location (city), cuisine, and/or name
     * All parameters are optional - pass null or empty string to skip that filter
     * Results are ordered by rating (highest first)
     * 
     * @deprecated Use search(name, location, cuisine) instead for optimized queries
     */
    @Deprecated
    public List<RestaurantResponseDTO> searchRestaurants(String city, String cuisine, String name) {
        return restaurantRepository.searchRestaurantsSimple(city, cuisine, name).stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get restaurants filtered by city (location)
     */
    public List<RestaurantResponseDTO> getRestaurantsByCity(String city) {
        return restaurantRepository.findByCityIgnoreCase(city).stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get restaurants filtered by location
     */
    public List<RestaurantResponseDTO> getRestaurantsByLocation(String location) {
        return restaurantRepository.findByLocationIgnoreCase(location).stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get restaurants filtered by cuisine type
     */
    public List<RestaurantResponseDTO> getRestaurantsByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineIgnoreCase(cuisine).stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search restaurants by name (partial match)
     */
    public List<RestaurantResponseDTO> searchRestaurantsByName(String name) {
        return restaurantRepository.searchByName(name).stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get top rated restaurants
     */
    public List<RestaurantResponseDTO> getTopRatedRestaurants() {
        return restaurantRepository.findByActiveTrueOrderByRatingDesc().stream()
                .map(this::mapToRestaurantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all distinct cuisines for filter dropdown
     */
    public List<String> getAllCuisines() {
        return restaurantRepository.findDistinctCuisines();
    }

    /**
     * Get all distinct locations for filter dropdown
     */
    public List<String> getAllLocations() {
        return restaurantRepository.findDistinctLocations();
    }

    /**
     * Get all distinct cities for filter dropdown
     */
    public List<String> getAllCities() {
        return restaurantRepository.findDistinctCities();
    }

    // ==================== MAPPERS ====================

    /**
     * Map Restaurant entity to DTO
     */
    private RestaurantResponseDTO mapToRestaurantResponse(Restaurant restaurant) {
        return RestaurantResponseDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .location(restaurant.getLocation())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .cuisine(restaurant.getCuisine())
                .phoneNumber(restaurant.getPhoneNumber())
                .rating(restaurant.getRating())
                .active(restaurant.getActive())
                .ownerId(restaurant.getOwnerId())
                .build();
    }

    /**
     * Map Restaurant entity to DTO with cuisine from foods if not set on restaurant
     */
    private RestaurantResponseDTO mapToRestaurantResponseWithCuisine(Restaurant restaurant) {
        String cuisine = restaurant.getCuisine();
        
        // If restaurant doesn't have cuisine set, get it from first food item
        if ((cuisine == null || cuisine.isEmpty()) && 
            restaurant.getFoods() != null && !restaurant.getFoods().isEmpty()) {
            cuisine = restaurant.getFoods().get(0).getCuisine();
        }
        
        return RestaurantResponseDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .location(restaurant.getLocation())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .cuisine(cuisine)
                .phoneNumber(restaurant.getPhoneNumber())
                .rating(restaurant.getRating())
                .active(restaurant.getActive())
                .ownerId(restaurant.getOwnerId())
                .build();
    }

    private MenuItemResponseDTO mapToMenuItemResponse(MenuItem menuItem) {
        return MenuItemResponseDTO.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                .category(menuItem.getCategory())
                .available(menuItem.getAvailable())
                .restaurantId(menuItem.getRestaurantId())
                .build();
    }
}
