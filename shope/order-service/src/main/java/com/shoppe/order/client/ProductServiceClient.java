package com.shoppe.order.client;

import com.shoppe.order.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "product-service")
public interface ProductServiceClient {

    @GetMapping("/api/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);

    @PutMapping("/api/products/{id}")
    ProductDto updateProduct(@PathVariable("id") Long id, @RequestBody ProductDto dto);
}
