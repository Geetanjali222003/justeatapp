package com.CAPSTONEPROJECT.CAPSTONE.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Food entity - Represents food items available at a restaurant
 * 
 * Relationships:
 * - ManyToOne with Restaurant
 * 
 * NOTE: All text fields use columnDefinition = "TEXT" to avoid PostgreSQL bytea issues
 */
@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Cuisine type (e.g., Italian, Indian, Chinese)
     * Used for cuisine-based search
     */
    @Column(columnDefinition = "TEXT")
    private String cuisine;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String category;

    @Column(name = "is_veg")
    @Builder.Default
    private Boolean isVeg = false;

    @Builder.Default
    private Boolean available = true;

    /**
     * Restaurant this food belongs to
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    /**
     * For backward compatibility - stores restaurant_id directly
     */
    @Column(name = "restaurant_id", insertable = false, updatable = false)
    private Long restaurantId;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}