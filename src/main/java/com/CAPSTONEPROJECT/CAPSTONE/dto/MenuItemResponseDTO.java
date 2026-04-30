package com.CAPSTONEPROJECT.CAPSTONE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Response DTO for menu item / food data
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponseDTO {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Boolean available;
    private Boolean isVeg;
    private Long restaurantId;
}

