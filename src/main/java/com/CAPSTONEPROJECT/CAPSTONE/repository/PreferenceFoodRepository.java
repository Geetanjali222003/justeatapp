package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.PreferenceFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PreferenceFoodRepository - Data access for user's favorite foods
 */
@Repository
public interface PreferenceFoodRepository extends JpaRepository<PreferenceFood, Long> {

    /**
     * Find all favorite foods for a preference
     */
    List<PreferenceFood> findByPreferenceId(Long preferenceId);

    /**
     * Delete all favorite foods for a preference
     */
    void deleteByPreferenceId(Long preferenceId);

    /**
     * Check if a food is already in favorites
     */
    boolean existsByPreferenceIdAndFoodId(Long preferenceId, Long foodId);
}

