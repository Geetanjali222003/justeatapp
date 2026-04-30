package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Entity
@Table(name = "preference_restaurants")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PreferenceRestaurant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "preference_id", nullable = false)
    private Long preferenceId;
    @NotNull @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
}