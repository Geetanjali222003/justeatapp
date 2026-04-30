package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PreferenceRepository - Data access for user preferences
 */
@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {

    /**
     * Find preference by user ID
     */
    Optional<Preference> findByUserId(Long userId);

    /**
     * Check if user has preferences
     */
    boolean existsByUserId(Long userId);
}

