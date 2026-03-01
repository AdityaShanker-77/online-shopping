package com.shoppe.product.repository;

import com.shoppe.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByRetailerId(Long retailerId);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findByNameContainingIgnoreCaseAndCategoryId(String keyword, Long categoryId);
}
