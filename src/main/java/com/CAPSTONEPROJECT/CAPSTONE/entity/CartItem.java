package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "cart_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "cart_id", nullable = false)
    private Long cartId;
    @NotNull @Column(name = "food_id", nullable = false)
    private Long foodId;
    @NotNull @Min(1) @Builder.Default
    private Integer quantity = 1;
    @Column(name = "price_at_add", precision = 10, scale = 2)
    private BigDecimal priceAtAdd;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}