package com.shoppe.backend.user.controller;

import com.shoppe.backend.order.repository.OrderRepository;
import com.shoppe.backend.order.repository.WishlistRepository;
import com.shoppe.backend.user.dto.UserProfileDto;
import com.shoppe.backend.user.model.User;
import com.shoppe.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('USER') or hasRole('RETAILER') or hasRole('ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()));
        dto.setWishlistCount(wishlistRepository.findByUserId(user.getId()).size());
        dto.setOrderCount(orderRepository.findByUserId(user.getId()).size());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDto profileDto, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        user.setName(profileDto.getName());
        if (profileDto.getEmail() != null && !profileDto.getEmail().equals(user.getEmail())) {
             // In a real app we need to check if email is taken
             user.setEmail(profileDto.getEmail());
        }
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
