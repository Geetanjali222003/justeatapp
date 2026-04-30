package com.CAPSTONEPROJECT.CAPSTONE.controller;

import com.CAPSTONEPROJECT.CAPSTONE.dto.MenuItemResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.dto.RestaurantResponseDTO;
import com.CAPSTONEPROJECT.CAPSTONE.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CustomerController - Handles restaurant viewing for customers
 * 
 * Endpoints:
 * - GET /customer/restaurants - Get all restaurants
 * - GET /customer/menu/{restaurantId} - Get menu items for a restaurant
 */
@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CustomerController {

    private final RestaurantService restaurantService;

    /**
     * Get all restaurants
     */
    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantResponseDTO>> getAllRestaurants() {
        List<RestaurantResponseDTO> restaurants = restaurantService.getAllRestaurants();
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
     * Get menu items for a restaurant (only available items)
     */
    @GetMapping("/menu/{restaurantId}")
    public ResponseEntity<List<MenuItemResponseDTO>> getMenuByRestaurant(
            @PathVariable Long restaurantId) {
        
        List<MenuItemResponseDTO> menuItems = restaurantService.getMenuByRestaurant(restaurantId);
        return ResponseEntity.ok(menuItems);
    }
}

