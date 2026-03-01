package com.shoppe.retailer.repository;

import com.shoppe.retailer.model.Retailer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface RetailerRepository extends JpaRepository<Retailer, Long> {
    Optional<Retailer> findByUserId(Long userId);
    List<Retailer> findByIsApproved(boolean isApproved);
}
