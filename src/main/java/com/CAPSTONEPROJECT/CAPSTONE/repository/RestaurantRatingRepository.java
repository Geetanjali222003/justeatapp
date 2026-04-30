package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.RestaurantRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * RestaurantRatingRepository - Data access for restaurant ratings/reviews
 */
@Repository
public interface RestaurantRatingRepository extends JpaRepository<RestaurantRating, Long> {

    /**
     * Find all ratings for a restaurant
     */
    List<RestaurantRating> findByRestaurantId(Long restaurantId);

    /**
     * Find rating by user and restaurant (to check if user already rated)
     */
    Optional<RestaurantRating> findByUserIdAndRestaurantId(Long userId, Long restaurantId);

    /**
     * Check if user has already rated a restaurant
     */
    boolean existsByUserIdAndRestaurantId(Long userId, Long restaurantId);

    /**
     * Calculate average rating for a restaurant
     */
    @Query("SELECT AVG(r.rating) FROM RestaurantRating r WHERE r.restaurantId = :restaurantId")
    BigDecimal calculateAverageRating(@Param("restaurantId") Long restaurantId);

    /**
     * Count total ratings for a restaurant
     */
    long countByRestaurantId(Long restaurantId);
}

