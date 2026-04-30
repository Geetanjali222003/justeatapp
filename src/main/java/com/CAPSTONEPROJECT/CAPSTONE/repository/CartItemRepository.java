package com.CAPSTONEPROJECT.CAPSTONE.repository;
import com.CAPSTONEPROJECT.CAPSTONE.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);
    Optional<CartItem> findByCartIdAndFoodId(Long cartId, Long foodId);
    void deleteByCartId(Long cartId);
}