package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "restaurant_ratings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RestaurantRating {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @NotNull @Column(name = "user_id", nullable = false)
    private Long userId;
    @NotNull @Min(1) @Max(5)
    private Integer rating;
    @Column(length = 1000)
    private String review;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}