package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Response DTO for restaurant data
 * Includes all fields needed for search results: name, location, cuisine, rating
 * 
 * Note: Entity is NOT exposed directly - this DTO is used for all responses
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String location;    // Location for search
    private String address;
    private String city;
    private String cuisine;
    private String phoneNumber;
    private BigDecimal rating;  // Average rating (1-5)
    private Boolean active;
    private Long ownerId;
}

