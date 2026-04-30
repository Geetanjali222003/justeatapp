package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "preferences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Preference {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;
    @Column(name = "preferred_cuisine", length = 100)
    private String preferredCuisine;
    @Column(name = "is_veg_only") @Builder.Default
    private Boolean isVegOnly = false;
    @Column(name = "max_price_range", precision = 10, scale = 2)
    private BigDecimal maxPriceRange;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}