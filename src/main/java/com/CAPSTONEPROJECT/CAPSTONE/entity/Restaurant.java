package com.CAPSTONEPROJECT.CAPSTONE.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Restaurant entity - Represents a restaurant owned by an OWNER user
 * 
 * Relationships:
 * - ManyToOne with User (owner)
 * - OneToMany with Food (foods served)
 * 
 * NOTE: All text fields use columnDefinition = "TEXT" to avoid PostgreSQL bytea issues
 */
@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Restaurant name is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Location/city of the restaurant - used for location-based search
     */
    @Column(columnDefinition = "TEXT")
    private String location;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String city;

    @Column(columnDefinition = "TEXT")
    private String cuisine;

    @Column(columnDefinition = "TEXT")
    private String phoneNumber;

    /**
     * Average rating (1-5) calculated from RestaurantRating entries
     */
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    /**
     * Whether the restaurant is currently active/accepting orders
     */
    @Builder.Default
    private Boolean active = true;

    /**
     * Owner of this restaurant (User with OWNER role)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    /**
     * For backward compatibility - stores owner_id directly
     */
    @Column(name = "owner_id", insertable = false, updatable = false)
    private Long ownerId;

    /**
     * Foods/menu items available at this restaurant
     * Used for cuisine-based search
     */
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Food> foods = new ArrayList<>();

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
