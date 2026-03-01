package com.shoppe.order.repository;

import com.shoppe.order.model.CompareItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompareItemRepository extends JpaRepository<CompareItem, Long> {
    List<CompareItem> findByUserId(Long userId);

    long countByUserId(Long userId);

    Optional<CompareItem> findByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserIdAndProductId(Long userId, Long productId);
}
