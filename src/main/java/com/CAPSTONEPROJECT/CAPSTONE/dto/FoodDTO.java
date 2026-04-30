package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * DTO for food item details
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodDTO {
    private Long id;
    private String name;
    private String description;
    private String cuisine;
    private BigDecimal price;
    private String category;
    private Boolean isVeg;
    private Boolean available;
}

