package com.shoppe.product.service;

import com.shoppe.product.dto.ProductDto;
import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();
    ProductDto getProductById(Long id);
    ProductDto createProduct(ProductDto dto);
    ProductDto updateProduct(Long id, ProductDto dto);
    void deleteProduct(Long id);
    List<ProductDto> getProductsByCategory(Long categoryId);
    List<ProductDto> getProductsByRetailer(Long retailerId);
    List<ProductDto> searchProducts(String keyword);
    List<ProductDto> searchProductsInCategory(String keyword, Long categoryId);
}
