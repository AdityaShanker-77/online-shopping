package com.shoppe.backend.product.repository;

import com.shoppe.backend.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByRetailerId(Long retailerId);
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
