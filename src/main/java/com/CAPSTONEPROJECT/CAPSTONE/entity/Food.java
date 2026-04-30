package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "foods")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Food {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(nullable = false, length = 100)
    private String name;
    @Column(length = 500)
    private String description;
    @Column(length = 100)
    private String cuisine;
    @NotNull @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    @Column(length = 50)
    private String category;
    @Column(name = "is_veg") @Builder.Default
    private Boolean isVeg = false;
    @Builder.Default
    private Boolean available = true;
    @NotNull @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}