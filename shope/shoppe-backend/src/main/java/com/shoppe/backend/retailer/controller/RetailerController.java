package com.shoppe.backend.retailer.controller;

import com.shoppe.backend.product.dto.ProductDto;
import com.shoppe.backend.product.service.ProductService;
import com.shoppe.backend.retailer.dto.RetailerProfileDto;
import com.shoppe.backend.retailer.service.RetailerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/retailer")
@PreAuthorize("hasRole('RETAILER')")
public class RetailerController {

    @Autowired
    private RetailerService retailerService;

    @Autowired
    private ProductService productService;

    @GetMapping("/profile")
    public ResponseEntity<RetailerProfileDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok(retailerService.getRetailerProfile(authentication.getName()));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getMyProducts(Authentication authentication) {
        RetailerProfileDto profile = retailerService.getRetailerProfile(authentication.getName());
        return ResponseEntity.ok(productService.getProductsByRetailer(profile.getId()));
    }
}
