package com.shoppe.product.controller;

import com.shoppe.product.dto.ProductDto;
import com.shoppe.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Product API")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products with optional filters")
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) {

        if (keyword != null && !keyword.isBlank()) {
            if (categoryId != null) {
                return ResponseEntity.ok(productService.searchProductsInCategory(keyword, categoryId));
            }
            return ResponseEntity.ok(productService.searchProducts(keyword));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @Operation(summary = "Create a product")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @GetMapping("/by-retailer/{retailerId}")
    @Operation(summary = "Get products by retailer")
    public ResponseEntity<List<ProductDto>> getByRetailer(@PathVariable Long retailerId) {
        return ResponseEntity.ok(productService.getProductsByRetailer(retailerId));
    }

    @GetMapping("/by-category/{categoryId}")
    @Operation(summary = "Get products by category")
    public ResponseEntity<List<ProductDto>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @PostMapping("/upload-image")
    @Operation(summary = "Upload a product image file")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) throws IOException {
        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png")
                || contentType.equals("image/webp"))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Invalid format. Only JPEG, PNG, and WebP are accepted."));
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "File size must not exceed 5MB."));
        }

        // Read image dimensions
        BufferedImage img = ImageIO.read(file.getInputStream());
        int width = img != null ? img.getWidth() : 0;
        int height = img != null ? img.getHeight() : 0;

        String warning = null;
        if (width < 600 || height < 600) {
            warning = "Image is too small (" + width + "x" + height
                    + "). Recommended: at least 800x800px for best quality.";
        } else if (width > 2000 || height > 2000) {
            warning = "Image is very large (" + width + "x" + height + "). Recommended: 800x800 to 1200x1200px.";
        }

        // Convert to Base64 data URL
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String dataUrl = "data:" + contentType + ";base64," + base64;

        var response = new java.util.LinkedHashMap<String, Object>();
        response.put("imageUrl", dataUrl);
        response.put("width", width);
        response.put("height", height);
        if (warning != null)
            response.put("warning", warning);

        return ResponseEntity.ok(response);
    }
}
