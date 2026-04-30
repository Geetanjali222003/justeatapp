package com.CAPSTONEPROJECT.CAPSTONE.repository;
import com.CAPSTONEPROJECT.CAPSTONE.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByRestaurantId(Long restaurantId);
    List<Food> findByRestaurantIdAndAvailableTrue(Long restaurantId);
}