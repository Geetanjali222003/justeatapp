package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response DTO for restaurant data
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
    private String address;
    private String city;
    private String cuisine;
    private String phoneNumber;
    private Long ownerId;
}

