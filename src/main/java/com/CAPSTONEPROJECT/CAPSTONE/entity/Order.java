package com.CAPSTONEPROJECT.CAPSTONE.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "user_id", nullable = false)
    private Long userId;
    @NotNull @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    @NotNull @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING) @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    @Column(name = "delivery_address", length = 500)
    private String deliveryAddress;
    @Column(name = "special_instructions", length = 500)
    private String specialInstructions;
    @Column(name = "created_at") @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    public enum OrderStatus { PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED }
}