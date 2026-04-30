package com.CAPSTONEPROJECT.CAPSTONE.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request DTO for creating a restaurant
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRequestDTO {

    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;

    private String address;

    private String phoneNumber;
    
    // Frontend uses these fields
    private String city;
    
    private String cuisine;
}

