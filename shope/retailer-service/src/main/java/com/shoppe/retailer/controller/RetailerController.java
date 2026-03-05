package com.shoppe.retailer.controller;

import com.shoppe.retailer.dto.RetailerDto;
import com.shoppe.retailer.model.Retailer;
import com.shoppe.retailer.repository.RetailerRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/retailers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RetailerController {

    private final RetailerRepository retailerRepository;

    @GetMapping
    public ResponseEntity<List<RetailerDto>> getAll() {
        return ResponseEntity.ok(retailerRepository.findAll().stream().map(this::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetailerDto> getById(@PathVariable Long id) {
        return retailerRepository.findById(id)
                .map(r -> ResponseEntity.ok(toDto(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<RetailerDto> getByUser(@PathVariable Long userId) {
        return retailerRepository.findByUserId(userId)
                .map(r -> ResponseEntity.ok(toDto(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profile")
    public ResponseEntity<RetailerDto> getProfile(@RequestHeader("X-Auth-UserId") Long userId) {
        return retailerRepository.findByUserId(userId)
                .map(r -> ResponseEntity.ok(toDto(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RetailerDto> create(
            @RequestHeader("X-Auth-User") String email,
            @Valid @RequestBody RetailerDto dto) {
        Retailer r = new Retailer();
        r.setUserId(dto.getUserId());
        r.setStoreName(dto.getStoreName());
        r.setEmail(email);
        r.setDescription(dto.getDescription());
        r.setApproved(false);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(retailerRepository.save(r)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RetailerDto> update(@PathVariable Long id, @Valid @RequestBody RetailerDto dto) {
        Retailer r = retailerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));
        r.setStoreName(dto.getStoreName());
        r.setDescription(dto.getDescription());
        return ResponseEntity.ok(toDto(retailerRepository.save(r)));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<RetailerDto> approve(@PathVariable Long id) {
        Retailer r = retailerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));
        r.setApproved(true);
        return ResponseEntity.ok(toDto(retailerRepository.save(r)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        retailerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/revenue")
    public ResponseEntity<Void> addRevenue(@PathVariable Long id, @RequestParam java.math.BigDecimal amount) {
        Retailer r = retailerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));
        if (r.getRevenue() == null) {
            r.setRevenue(amount);
        } else {
            r.setRevenue(r.getRevenue().add(amount));
        }
        retailerRepository.save(r);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/sales")
    public ResponseEntity<?> getSalesData(@PathVariable Long id) {
        Retailer r = retailerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));
        Map<String, Object> sales = new java.util.HashMap<>();
        sales.put("retailerId", r.getId());
        sales.put("storeName", r.getStoreName());
        sales.put("totalRevenue", r.getRevenue());
        return ResponseEntity.ok(sales);
    }

    private RetailerDto toDto(Retailer r) {
        RetailerDto dto = new RetailerDto();
        dto.setId(r.getId());
        dto.setUserId(r.getUserId());
        dto.setStoreName(r.getStoreName());
        dto.setEmail(r.getEmail());
        dto.setRevenue(r.getRevenue());
        dto.setApproved(r.isApproved());
        dto.setDescription(r.getDescription());
        return dto;
    }
}
