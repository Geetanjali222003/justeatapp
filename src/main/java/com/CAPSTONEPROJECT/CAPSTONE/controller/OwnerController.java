package com.CAPSTONEPROJECT.CAPSTONE.controller;

import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantRequestDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.entity.User;
import com.CAPSTONEPROJECT.CAPSTONE.repository.UserRepository;
import com.CAPSTONEPROJECT.CAPSTONE.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * OwnerController - Handles restaurant and menu management for owners
 * 
 * Endpoints:
 * - POST /owner/restaurant - Create a new restaurant
 * - GET /owner/restaurants - Get all restaurants owned by the owner
 * - POST /owner/menu - Create a new menu item
 * - GET /owner/menu/{restaurantId} - Get all menu items for a restaurant
 */
@RestController
@RequestMapping("/owner")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class OwnerController {

    private final RestaurantService restaurantService;
    private final UserRepository userRepository;

    /**
     * Create a new restaurant
     */
    @PostMapping("/restaurant")
    public ResponseEntity<RestaurantResponseDTO> createRestaurant(
            @Valid @RequestBody RestaurantRequestDTO request,
            Authentication authentication) {
        
        Long ownerId = getOwnerId(authentication);
        RestaurantResponseDTO response = restaurantService.createRestaurant(request, ownerId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all restaurants owned by the current owner
     */
    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantResponseDTO>> getMyRestaurants(Authentication authentication) {
        Long ownerId = getOwnerId(authentication);
        List<RestaurantResponseDTO> restaurants = restaurantService.getRestaurantsByOwner(ownerId);
        
        return ResponseEntity.ok(restaurants);
    }

    /**
     * Create a new menu item for a restaurant
     */
    @PostMapping("/menu")
    public ResponseEntity<MenuItemResponseDTO> createMenuItem(
            @Valid @RequestBody MenuItemRequestDTO request,
            Authentication authentication) {
        
        Long ownerId = getOwnerId(authentication);
        MenuItemResponseDTO response = restaurantService.createMenuItem(request, ownerId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all menu items for a restaurant (including unavailable)
     */
    @GetMapping("/menu/{restaurantId}")
    public ResponseEntity<List<MenuItemResponseDTO>> getMenuByRestaurant(
            @PathVariable Long restaurantId) {
        
        List<MenuItemResponseDTO> menuItems = restaurantService.getAllMenuByRestaurant(restaurantId);
        return ResponseEntity.ok(menuItems);
    }

    /**
     * Helper method to get the owner's user ID from authentication
     */
    private Long getOwnerId(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return user.getId();
    }
}

