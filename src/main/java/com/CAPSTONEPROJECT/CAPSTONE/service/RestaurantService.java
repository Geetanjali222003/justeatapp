package com.CAPSTONEPROJECT.CAPSTONE.service;

import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.entity.MenuItem;
import com.CAPSTONEPROJECT.CAPSTONE.entity.Restaurant;
import com.CAPSTONEPROJECT.CAPSTONE.repository.MenuItemRepository;
import com.CAPSTONEPROJECT.CAPSTONE.repository.RestaurantRepository;
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

    // ==================== RESTAURANT OPERATIONS ====================

    /**
     * Create a new restaurant for the owner
     */
    @Transactional
    public RestaurantResponseDTO createRestaurant(RestaurantRequestDTO request, Long ownerId) {
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .cuisine(request.getCuisine())
                .phoneNumber(request.getPhoneNumber())
                .ownerId(ownerId)
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

    // ==================== MAPPERS ====================

    private RestaurantResponseDTO mapToRestaurantResponse(Restaurant restaurant) {
        return RestaurantResponseDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .cuisine(restaurant.getCuisine())
                .phoneNumber(restaurant.getPhoneNumber())
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

