package com.CAPSTONEPROJECT.CAPSTONE.repository;

import com.CAPSTONEPROJECT.CAPSTONE.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    /**
     * Find all restaurants owned by a specific owner
     */
    List<Restaurant> findByOwnerId(Long ownerId);

    /**
     * Find active restaurants
     */
    List<Restaurant> findByActiveTrue();

    /**
     * Find restaurants by location
     */
    List<Restaurant> findByLocationIgnoreCase(String location);

    /**
     * Find restaurants by city (location filter)
     */
    List<Restaurant> findByCityIgnoreCase(String city);

    /**
     * Find restaurants by cuisine type
     */
    List<Restaurant> findByCuisineIgnoreCase(String cuisine);

    /**
     * Search restaurants by name (case insensitive, partial match)
     * Uses CAST to TEXT for safe LOWER() operations
     */
    @Query(value = "SELECT * FROM restaurants r WHERE LOWER(CAST(r.name AS TEXT)) LIKE LOWER(CONCAT('%', :name, '%'))", nativeQuery = true)
    List<Restaurant> searchByName(@Param("name") String name);

    /**
     * Find top rated restaurants (active only)
     */
    List<Restaurant> findByActiveTrueOrderByRatingDesc();

    /**
     * OPTIMIZED SEARCH: Search restaurants by name, location, and cuisine
     * 
     * Uses DISTINCT to avoid duplicates when joining with foods table.
     * All parameters are optional - pass null to skip that filter.
     * Uses CAST to TEXT for safe LOWER() operations (avoids bytea issues).
     * Results ordered by rating (highest first).
     * 
     * @param name Restaurant name (partial match, case-insensitive)
     * @param location Restaurant location (partial match, case-insensitive)
     * @param cuisine Food cuisine type (partial match, case-insensitive)
     * @return List of matching restaurants
     */
    @Query(value = """
        SELECT DISTINCT r.* FROM restaurants r
        LEFT JOIN foods f ON r.id = f.restaurant_id
        WHERE r.active = true
        AND (:name IS NULL OR LOWER(CAST(r.name AS TEXT)) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:location IS NULL OR LOWER(CAST(r.location AS TEXT)) LIKE LOWER(CONCAT('%', :location, '%')) 
             OR LOWER(CAST(r.city AS TEXT)) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:cuisine IS NULL OR LOWER(CAST(r.cuisine AS TEXT)) LIKE LOWER(CONCAT('%', :cuisine, '%'))
             OR LOWER(CAST(f.cuisine AS TEXT)) LIKE LOWER(CONCAT('%', :cuisine, '%')))
        ORDER BY r.rating DESC NULLS LAST
        """, nativeQuery = true)
    List<Restaurant> searchRestaurants(
            @Param("name") String name,
            @Param("location") String location,
            @Param("cuisine") String cuisine
    );

    /**
     * Simple search by city, cuisine (on restaurant), and name
     * Uses CAST to TEXT for safe LOWER() operations
     */
    @Query(value = "SELECT * FROM restaurants r WHERE " +
           "(:city IS NULL OR :city = '' OR LOWER(CAST(r.city AS TEXT)) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:cuisine IS NULL OR :cuisine = '' OR LOWER(CAST(r.cuisine AS TEXT)) LIKE LOWER(CONCAT('%', :cuisine, '%'))) AND " +
           "(:name IS NULL OR :name = '' OR LOWER(CAST(r.name AS TEXT)) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "ORDER BY r.rating DESC NULLS LAST", nativeQuery = true)
    List<Restaurant> searchRestaurantsSimple(
            @Param("city") String city,
            @Param("cuisine") String cuisine,
            @Param("name") String name
    );

    /**
     * Get distinct cuisines from restaurants for filter dropdown
     */
    @Query("SELECT DISTINCT r.cuisine FROM Restaurant r WHERE r.cuisine IS NOT NULL AND r.cuisine <> '' ORDER BY r.cuisine")
    List<String> findDistinctCuisines();

    /**
     * Get distinct locations for filter dropdown
     */
    @Query("SELECT DISTINCT r.location FROM Restaurant r WHERE r.location IS NOT NULL AND r.location <> '' ORDER BY r.location")
    List<String> findDistinctLocations();

    /**
     * Get distinct cities for filter dropdown
     */
    @Query("SELECT DISTINCT r.city FROM Restaurant r WHERE r.city IS NOT NULL AND r.city <> '' ORDER BY r.city")
    List<String> findDistinctCities();
}

