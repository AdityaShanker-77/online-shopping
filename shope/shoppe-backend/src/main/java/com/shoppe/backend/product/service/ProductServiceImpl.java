package com.shoppe.backend.product.service;

import com.shoppe.backend.product.dto.ProductDto;
import com.shoppe.backend.product.model.Category;
import com.shoppe.backend.product.model.Product;
import com.shoppe.backend.product.repository.CategoryRepository;
import com.shoppe.backend.product.repository.ProductRepository;
import com.shoppe.backend.retailer.model.Retailer;
import com.shoppe.backend.retailer.repository.RetailerRepository;
import com.shoppe.backend.user.model.User;
import com.shoppe.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RetailerRepository retailerRepository;

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDto(product);
    }

    @Override
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getProductsByRetailer(Long retailerId) {
        return productRepository.findByRetailerId(retailerId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ProductDto createProduct(ProductDto productDto, String username) {
        User user = userRepository.findByEmail(username).orElseThrow();
        Retailer retailer = retailerRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Retailer not found"));
        
        Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setImageUrl(productDto.getImageUrl());
        product.setCategory(category);
        product.setRetailer(retailer);

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto, String username) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Basic authorization check could be added here to ensure the retailer owns the product
        
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow();
            product.setCategory(category);
        }
        
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setImageUrl(productDto.getImageUrl());

        return mapToDto(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id, String username) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    private ProductDto mapToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setRetailerId(product.getRetailer().getId());
        dto.setRetailerName(product.getRetailer().getStoreName());
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }
}
