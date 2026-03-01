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
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataImportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final RestTemplate restTemplate;

    private static final String FAKESTORE_API_URL = "https://fakestoreapi.com/products";

    @Transactional
    public String importData() {
        FakeStoreProductDto[] externalProducts = restTemplate.getForObject(FAKESTORE_API_URL, FakeStoreProductDto[].class);
        
        if (externalProducts == null || externalProducts.length == 0) {
            return "No products found to import.";
        }

        int importedCount = 0;
        for (FakeStoreProductDto ext : externalProducts) {
            // Check if product with this name already exists (simple check)
            if (productRepository.findAll().stream().anyMatch(p -> p.getName().equalsIgnoreCase(ext.getTitle()))) {
                continue;
            }

            // Get or create category
            Category category = categoryRepository.findByName(ext.getCategory())
                    .orElseGet(() -> {
                        Category newCat = new Category();
                        newCat.setName(ext.getCategory());
                        newCat.setDescription("Imported from FakeStore API");
                        return categoryRepository.save(newCat);
                    });

            Product product = new Product();
            product.setName(ext.getTitle());
            product.setDescription(ext.getDescription());
            product.setPrice(ext.getPrice());
            product.setStock(100); // Default stock
            product.setCategory(category);
            product.setRetailerId(1L); // Default retailer ID
            product.setImageUrl(ext.getImage());

            productRepository.save(product);
            importedCount++;
        }

        return "Successfully imported " + importedCount + " products.";
    }
}
