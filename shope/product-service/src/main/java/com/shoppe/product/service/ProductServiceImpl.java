package com.shoppe.product.service;

import com.shoppe.product.dto.ProductDto;
import com.shoppe.product.exception.ResourceNotFoundException;
import com.shoppe.product.model.Category;
import com.shoppe.product.model.Product;
import com.shoppe.product.repository.CategoryRepository;
import com.shoppe.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import com.shoppe.product.dto.FakeStoreProductDto;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long id) {
        try {
            return toDto(productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id)));
        } catch (ResourceNotFoundException e) {
            // Fetch dynamically from FakeStore API
            try {
                RestTemplate restTemplate = new RestTemplate();
                String fakeStoreUrl = "https://fakestoreapi.com/products/" + id;
                FakeStoreProductDto fakeProduct = restTemplate.getForObject(fakeStoreUrl, FakeStoreProductDto.class);

                if (fakeProduct != null) {
                    ProductDto mockDto = new ProductDto();
                    mockDto.setId(fakeProduct.getId());
                    mockDto.setName(fakeProduct.getTitle());
                    mockDto.setDescription(fakeProduct.getDescription());
                    mockDto.setPrice(fakeProduct.getPrice());
                    mockDto.setStock(100);
                    mockDto.setCategoryId(1L);
                    mockDto.setCategoryName(fakeProduct.getCategory());
                    mockDto.setRetailerId(1L);
                    mockDto.setImageUrl(fakeProduct.getImage());
                    return mockDto;
                }
            } catch (Exception ex) {
                // Fallback mock
            }

            ProductDto fallbackDto = new ProductDto();
            fallbackDto.setId(id);
            fallbackDto.setName("FakeStore Product " + id);
            fallbackDto.setDescription("Mocked product");
            fallbackDto.setPrice(java.math.BigDecimal.valueOf(19.99));
            fallbackDto.setStock(100);
            return fallbackDto;
        }
    }

    @Override
    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = fromDto(dto);
        return toDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        return toDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getProductsByRetailer(Long retailerId) {
        return productRepository.findByRetailerId(retailerId).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream().map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchProductsInCategory(String keyword, Long categoryId) {
        return productRepository.findByNameContainingIgnoreCaseAndCategoryId(keyword, categoryId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private ProductDto toDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setStock(p.getStock());
        dto.setCategoryId(p.getCategory().getId());
        dto.setCategoryName(p.getCategory().getName());
        dto.setRetailerId(p.getRetailerId());
        dto.setImageUrl(p.getImageUrl());
        return dto;
    }

    private Product fromDto(ProductDto dto) {
        Product p = new Product();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setStock(dto.getStock());
        p.setRetailerId(dto.getRetailerId());
        p.setImageUrl(dto.getImageUrl());
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        p.setCategory(category);
        return p;
    }
}
