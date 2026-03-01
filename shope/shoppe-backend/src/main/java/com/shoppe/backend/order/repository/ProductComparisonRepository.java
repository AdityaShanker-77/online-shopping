package com.shoppe.backend.order.repository;

import com.shoppe.backend.order.model.ProductComparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductComparisonRepository extends JpaRepository<ProductComparison, Long> {
    List<ProductComparison> findByUserId(Long userId);
    Optional<ProductComparison> findByUserIdAndProductId(Long userId, Long productId);
    long countByUserId(Long userId);
}
