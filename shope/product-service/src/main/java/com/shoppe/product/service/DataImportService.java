package com.shoppe.product.service;

import com.shoppe.product.dto.FakeStoreProductDto;
import com.shoppe.product.model.Category;
import com.shoppe.product.model.Product;
import com.shoppe.product.repository.CategoryRepository;
import com.shoppe.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class DataImportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final RestTemplate restTemplate;

    private static final String FAKESTORE_API_URL = "https://fakestoreapi.com/products";

    @Transactional
    public String importData() {
        try {
            FakeStoreProductDto[] products = restTemplate.getForObject(FAKESTORE_API_URL, FakeStoreProductDto[].class);

            if (products == null || products.length == 0) {
                return "No products returned from FakeStore API.";
            }

            int importedCount = 0;

            for (FakeStoreProductDto ext : products) {
                // Skip if product with this name already exists
                String productName = ext.getTitle();
                if (productName != null && productName.length() > 200) {
                    productName = productName.substring(0, 200);
                }
                final String finalName = productName;
                if (productRepository.findAll().stream()
                        .anyMatch(p -> p.getName().equalsIgnoreCase(finalName))) {
                    continue;
                }

                // Get or create category
                String categoryName = ext.getCategory();
                if (categoryName == null || categoryName.isBlank()) {
                    categoryName = "Uncategorized";
                }
                // Capitalize first letter
                categoryName = categoryName.substring(0, 1).toUpperCase() + categoryName.substring(1);

                final String finalCatName = categoryName;
                Category category = categoryRepository.findByName(finalCatName)
                        .orElseGet(() -> {
                            Category newCat = new Category();
                            newCat.setName(finalCatName);
                            newCat.setDescription("Imported from FakeStore API");
                            return categoryRepository.save(newCat);
                        });

                Product product = new Product();
                product.setName(finalName);

                String desc = ext.getDescription();
                if (desc != null && desc.length() > 1990) {
                    desc = desc.substring(0, 1990);
                }
                product.setDescription(desc);

                product.setPrice(ext.getPrice());
                product.setStock(100); // FakeStore API doesn't have stock
                product.setCategory(category);
                product.setRetailerId(1L);

                // Image URL directly from FakeStore (these are reliable CDN URLs)
                String imageUrl = ext.getImage();
                if (imageUrl == null || imageUrl.isBlank()) {
                    imageUrl = "";
                }
                product.setImageUrl(imageUrl);

                productRepository.save(product);
                importedCount++;
            }

            return "Successfully imported " + importedCount + " products from FakeStore API.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Import failed: " + e.getClass().getName() + " - " + e.getMessage();
        }
    }

    @Transactional
    public String resetAndImport() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        return importData();
    }
}
