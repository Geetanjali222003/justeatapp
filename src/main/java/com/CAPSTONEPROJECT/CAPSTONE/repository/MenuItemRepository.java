package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MenuItemRepository - Data access for menu items
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    /**
     * Find all menu items for a restaurant
     */
    List<MenuItem> findByRestaurantId(Long restaurantId);

    /**
     * Find only available menu items for a restaurant (for customers)
     */
    List<MenuItem> findByRestaurantIdAndAvailableTrue(Long restaurantId);

    /**
     * Find menu items by category
     */
    List<MenuItem> findByRestaurantIdAndCategory(Long restaurantId, String category);

    /**
     * Find vegetarian items only
     */
    List<MenuItem> findByRestaurantIdAndIsVegTrue(Long restaurantId);
}

