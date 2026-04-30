package com.CAPSTONEPROJECT.CAPSTONE.service;

import com.CAPSTONEPROJECT.CAPSTONE.entity.*;
import com.CAPSTONEPROJECT.CAPSTONE.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * OrderService - Handles order operations
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartService cartService;
    private final CartItemRepository cartItemRepository;
    private final FoodRepository foodRepository;
    private final RestaurantRepository restaurantRepository;

    /**
     * Create order from cart
     */
    @Transactional
    public Order createOrderFromCart(Long userId, String deliveryAddress, String specialInstructions) {
        List<CartItem> cartItems = cartService.getCartItems(userId);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Get restaurant ID from first item (assuming single restaurant per order)
        Food firstFood = foodRepository.findById(cartItems.get(0).getFoodId())
                .orElseThrow(() -> new RuntimeException("Food not found"));
        
        Long restaurantId = firstFood.getRestaurantId();

        // Validate all items are from same restaurant
        for (CartItem item : cartItems) {
            Food food = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food not found"));
            if (!food.getRestaurantId().equals(restaurantId)) {
                throw new RuntimeException("All items must be from the same restaurant");
            }
        }

        // Calculate total
        BigDecimal total = cartService.getCartTotal(userId);

        // Create order
        Order order = Order.builder()
                .userId(userId)
                .restaurantId(restaurantId)
                .totalAmount(total)
                .status(Order.OrderStatus.PENDING)
                .deliveryAddress(deliveryAddress)
                .specialInstructions(specialInstructions)
                .build();

        order = orderRepository.save(order);

        // Create order items
        for (CartItem cartItem : cartItems) {
            Food food = foodRepository.findById(cartItem.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food not found"));
            
            OrderItem orderItem = OrderItem.builder()
                    .orderId(order.getId())
                    .foodId(cartItem.getFoodId())
                    .quantity(cartItem.getQuantity())
                    .priceAtOrder(food.getPrice())
                    .build();
            
            orderItemRepository.save(orderItem);
        }

        // Clear cart
        cartService.clearCart(userId);

        return order;
    }

    /**
     * Get orders for customer
     */
    public List<Order> getCustomerOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get orders for restaurant owner
     */
    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    /**
     * Update order status (for owner)
     */
    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus, Long ownerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify owner owns the restaurant
        Restaurant restaurant = restaurantRepository.findById(order.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Not authorized to update this order");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Cancel order (for customer - only if PENDING)
     */
    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this order");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Can only cancel pending orders");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    /**
     * Get order items
     */
    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    /**
     * Get order by ID
     */
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}

