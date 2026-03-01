package com.shoppe.backend.auth.controller;

import com.shoppe.backend.auth.dto.JwtResponse;
import com.shoppe.backend.auth.dto.LoginRequest;
import com.shoppe.backend.auth.dto.SignupRequest;
import com.shoppe.backend.auth.security.JwtUtils;
import com.shoppe.backend.user.model.Role;
import com.shoppe.backend.user.model.RoleName;
import com.shoppe.backend.user.model.User;
import com.shoppe.backend.retailer.model.Retailer;
import com.shoppe.backend.user.repository.RoleRepository;
import com.shoppe.backend.user.repository.UserRepository;
import com.shoppe.backend.retailer.repository.RetailerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;
    
    @Autowired
    RetailerRepository retailerRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        org.springframework.security.core.userdetails.User userDetails = 
            (org.springframework.security.core.userdetails.User) authentication.getPrincipal(); 
            
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new com.shoppe.backend.auth.dto.MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        String requestRole = signUpRequest.getRole();

        if (requestRole != null && requestRole.equalsIgnoreCase("RETAILER")) {
            Role userRole = roleRepository.findByName(RoleName.ROLE_RETAILER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        
        // If retailer, create retailer profile
        if (requestRole != null && requestRole.equalsIgnoreCase("RETAILER")) {
            Retailer retailer = new Retailer();
            retailer.setUser(savedUser);
            retailer.setStoreName(signUpRequest.getName() + " Store");
            retailerRepository.save(retailer);
        }

        return ResponseEntity.ok(new com.shoppe.backend.auth.dto.MessageResponse("User registered successfully!"));
    }
}
