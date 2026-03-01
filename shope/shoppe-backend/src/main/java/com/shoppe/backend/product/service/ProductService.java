package com.shoppe.backend.product.service;

import com.shoppe.backend.product.dto.ProductDto;

import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();
    ProductDto getProductById(Long id);
    List<ProductDto> getProductsByCategory(Long categoryId);
    List<ProductDto> getProductsByRetailer(Long retailerId);
    List<ProductDto> searchProducts(String keyword);
    ProductDto createProduct(ProductDto productDto, String username);
    ProductDto updateProduct(Long id, ProductDto productDto, String username);
    void deleteProduct(Long id, String username);
}
