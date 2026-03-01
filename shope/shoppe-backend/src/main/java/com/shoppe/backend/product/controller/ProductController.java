package com.shoppe.backend.product.controller;

import com.shoppe.backend.product.dto.ProductDto;
import com.shoppe.backend.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        
        List<ProductDto> products;
        if (categoryId != null) {
            products = productService.getProductsByCategory(categoryId);
        } else if (keyword != null && !keyword.isEmpty()) {
            products = productService.searchProducts(keyword);
        } else {
            products = productService.getAllProducts();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PreAuthorize("hasRole('RETAILER') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(productService.createProduct(productDto, username));
    }

    @PreAuthorize("hasRole('RETAILER') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id, 
            @RequestBody ProductDto productDto, 
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(productService.updateProduct(id, productDto, username));
    }

    @PreAuthorize("hasRole('RETAILER') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        productService.deleteProduct(id, username);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
