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
     * Find restaurants by city
     */
    List<Restaurant> findByCityIgnoreCase(String city);

    /**
     * Find restaurants by cuisine
     */
    List<Restaurant> findByCuisineIgnoreCase(String cuisine);

    /**
     * Search restaurants by name (case insensitive)
     */
    @Query("SELECT r FROM Restaurant r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%')) AND r.active = true")
    List<Restaurant> searchByName(@Param("name") String name);

    /**
     * Find top rated restaurants
     */
    List<Restaurant> findByActiveTrueOrderByRatingDesc();
}

