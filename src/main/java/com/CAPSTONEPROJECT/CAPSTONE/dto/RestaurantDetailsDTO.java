package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for restaurant details with food items
 * Used when customer clicks on a restaurant to view menu
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDetailsDTO {
    
    private Long id;
    private String name;
    private String description;
    private String location;
    private String address;
    private String city;
    private String cuisine;
    private String phoneNumber;
    private BigDecimal rating;
    private Boolean active;
    private Long ownerId;
    
    // List of food items at this restaurant
    private List<FoodDTO> foods;
}

