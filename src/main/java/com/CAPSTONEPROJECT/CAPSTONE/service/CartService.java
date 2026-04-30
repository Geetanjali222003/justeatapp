package com.CAPSTONEPROJECT.CAPSTONE.service;

import com.CAPSTONEPROJECT.CAPSTONE.entity.*;
import com.CAPSTONEPROJECT.CAPSTONE.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * CartService - Handles cart operations for customers
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodRepository foodRepository;

    /**
     * Get or create cart for user
     */
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart cart = Cart.builder().userId(userId).build();
                    return cartRepository.save(cart);
                });
    }

    /**
     * Add item to cart
     */
    @Transactional
    public CartItem addToCart(Long userId, Long foodId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));
        
        if (!food.getAvailable()) {
            throw new RuntimeException("Food item is not available");
        }

        // Check if item already in cart
        CartItem existingItem = cartItemRepository.findByCartIdAndFoodId(cart.getId(), foodId)
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        }

        CartItem cartItem = CartItem.builder()
                .cartId(cart.getId())
                .foodId(foodId)
                .quantity(quantity)
                .priceAtAdd(food.getPrice())
                .build();

        return cartItemRepository.save(cartItem);
    }

    /**
     * Update item quantity in cart
     */
    @Transactional
    public CartItem updateCartItem(Long userId, Long foodId, Integer quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndFoodId(cart.getId(), foodId)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    /**
     * Remove item from cart
     */
    @Transactional
    public void removeFromCart(Long userId, Long foodId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndFoodId(cart.getId(), foodId)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        cartItemRepository.delete(cartItem);
    }

    /**
     * Get cart items
     */
    public List<CartItem> getCartItems(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) {
            return List.of();
        }
        return cartItemRepository.findByCartId(cart.getId());
    }

    /**
     * Calculate cart total
     */
    public BigDecimal getCartTotal(Long userId) {
        List<CartItem> items = getCartItems(userId);
        return items.stream()
                .map(item -> item.getPriceAtAdd().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Clear cart
     */
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
        }
    }
}

