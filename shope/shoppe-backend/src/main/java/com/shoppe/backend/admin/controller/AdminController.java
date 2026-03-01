package com.shoppe.backend.admin.controller;

import com.shoppe.backend.retailer.model.Retailer;
import com.shoppe.backend.retailer.repository.RetailerRepository;
import com.shoppe.backend.user.model.User;
import com.shoppe.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RetailerRepository retailerRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/retailers")
    public ResponseEntity<List<Retailer>> getAllRetailers() {
        return ResponseEntity.ok(retailerRepository.findAll());
    }

    @PutMapping("/retailers/{id}/approve")
    public ResponseEntity<?> approveRetailer(@PathVariable Long id) {
        Retailer retailer = retailerRepository.findById(id).orElseThrow();
        retailer.setApproved(true);
        retailerRepository.save(retailer);
        return ResponseEntity.ok("Retailer approved successfully");
    }

    @DeleteMapping("/retailers/{id}")
    public ResponseEntity<?> deleteRetailer(@PathVariable Long id) {
        retailerRepository.deleteById(id);
        return ResponseEntity.ok("Retailer deleted successfully");
    }
}
