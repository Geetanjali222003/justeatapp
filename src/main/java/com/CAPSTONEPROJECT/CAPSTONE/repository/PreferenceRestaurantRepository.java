package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.PreferenceRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PreferenceRestaurantRepository - Data access for user's favorite restaurants
 */
@Repository
public interface PreferenceRestaurantRepository extends JpaRepository<PreferenceRestaurant, Long> {

    /**
     * Find all favorite restaurants for a preference
     */
    List<PreferenceRestaurant> findByPreferenceId(Long preferenceId);

    /**
     * Delete all favorite restaurants for a preference
     */
    void deleteByPreferenceId(Long preferenceId);

    /**
     * Check if a restaurant is already in favorites
     */
    boolean existsByPreferenceIdAndRestaurantId(Long preferenceId, Long restaurantId);
}

