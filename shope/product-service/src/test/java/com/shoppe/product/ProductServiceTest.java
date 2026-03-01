package com.shoppe.product;

import com.shoppe.product.dto.ProductDto;
import com.shoppe.product.exception.ResourceNotFoundException;
import com.shoppe.product.model.Category;
import com.shoppe.product.model.Product;
import com.shoppe.product.repository.CategoryRepository;
import com.shoppe.product.repository.ProductRepository;
import com.shoppe.product.service.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Category category;
    private Product product;

    @BeforeEach
    void setUp() {
        category = new Category(1L, "Electronics", "Electronic items");

        product = new Product();
        product.setId(1L);
        product.setName("Laptop");
        product.setDescription("A laptop");
        product.setPrice(BigDecimal.valueOf(999.99));
        product.setStock(10);
        product.setCategory(category);
        product.setRetailerId(1L);
    }

    @Test
    void getAllProducts_shouldReturnList() {
        when(productRepository.findAll()).thenReturn(List.of(product));
        List<ProductDto> result = productService.getAllProducts();
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getName());
    }

    @Test
    void getProductById_whenExists_shouldReturnDto() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        ProductDto result = productService.getProductById(1L);
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(BigDecimal.valueOf(999.99), result.getPrice());
    }

    @Test
    void getProductById_whenNotExists_shouldThrowException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(99L));
    }

    @Test
    void createProduct_shouldSaveAndReturnDto() {
        ProductDto dto = new ProductDto();
        dto.setName("Laptop");
        dto.setPrice(BigDecimal.valueOf(999.99));
        dto.setStock(10);
        dto.setCategoryId(1L);
        dto.setRetailerId(1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDto result = productService.createProduct(dto);
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void deleteProduct_whenNotExists_shouldThrow() {
        when(productRepository.existsById(99L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(99L));
    }

    @Test
    void searchProducts_shouldReturnMatchingProducts() {
        when(productRepository.findByNameContainingIgnoreCase("lap")).thenReturn(List.of(product));
        List<ProductDto> result = productService.searchProducts("lap");
        assertEquals(1, result.size());
    }
}
