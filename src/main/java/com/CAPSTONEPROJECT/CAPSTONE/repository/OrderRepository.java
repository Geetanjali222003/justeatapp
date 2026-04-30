package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * OrderRepository - Data access for orders
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders for a customer, ordered by creation date (newest first)
     */
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find all orders for a restaurant, ordered by creation date (newest first)
     */
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    /**
     * Find orders by status
     */
    List<Order> findByStatus(Order.OrderStatus status);

    /**
     * Find orders for a restaurant by status
     */
    List<Order> findByRestaurantIdAndStatus(Long restaurantId, Order.OrderStatus status);

    /**
     * Find orders for a customer by status
     */
    List<Order> findByUserIdAndStatus(Long userId, Order.OrderStatus status);
}

