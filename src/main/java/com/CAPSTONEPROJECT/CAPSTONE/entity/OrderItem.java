package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "order_id", nullable = false)
    private Long orderId;
    @NotNull @Column(name = "food_id", nullable = false)
    private Long foodId;
    @NotNull @Min(1) @Builder.Default
    private Integer quantity = 1;
    @NotNull @Column(name = "price_at_order", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtOrder;
}