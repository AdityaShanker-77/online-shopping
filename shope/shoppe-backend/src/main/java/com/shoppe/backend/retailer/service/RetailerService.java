package com.shoppe.backend.retailer.service;

import com.shoppe.backend.retailer.dto.RetailerProfileDto;
import com.shoppe.backend.retailer.model.Retailer;
import com.shoppe.backend.retailer.repository.RetailerRepository;
import com.shoppe.backend.user.model.User;
import com.shoppe.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RetailerService {

    @Autowired
    private RetailerRepository retailerRepository;

    @Autowired
    private UserRepository userRepository;

    public RetailerProfileDto getRetailerProfile(String username) {
        User user = userRepository.findByEmail(username).orElseThrow();
        Retailer retailer = retailerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Retailer profile not found"));
        return mapToDto(retailer);
    }
    
    // Admin uses this
    public RetailerProfileDto getRetailerById(Long id) {
        Retailer retailer = retailerRepository.findById(id).orElseThrow();
        return mapToDto(retailer);
    }

    private RetailerProfileDto mapToDto(Retailer retailer) {
        RetailerProfileDto dto = new RetailerProfileDto();
        dto.setId(retailer.getId());
        dto.setStoreName(retailer.getStoreName());
        dto.setOwnerName(retailer.getUser().getName());
        dto.setEmail(retailer.getUser().getEmail());
        dto.setRevenue(retailer.getRevenue());
        dto.setApproved(retailer.isApproved());
        return dto;
    }
}
