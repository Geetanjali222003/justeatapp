package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Entity
@Table(name = "preference_foods")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PreferenceFood {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "preference_id", nullable = false)
    private Long preferenceId;
    @NotNull @Column(name = "food_id", nullable = false)
    private Long foodId;
}