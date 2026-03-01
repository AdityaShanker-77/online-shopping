package com.shoppe.product.controller;

import com.shoppe.product.service.DataImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/import")
@RequiredArgsConstructor
public class DataImportController {

    private final DataImportService dataImportService;

    @PostMapping
    public ResponseEntity<String> importData() {
        String result = dataImportService.importData();
        return ResponseEntity.ok(result);
    }
}
