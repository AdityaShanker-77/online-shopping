package com.shoppe.auth.controller;

import com.shoppe.auth.dto.*;
import com.shoppe.auth.model.*;
import com.shoppe.auth.repository.RoleRepository;
import com.shoppe.auth.repository.UserRepository;
import com.shoppe.auth.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        // Include userId ('id' claim) in JWT so gateway can inject X-Auth-UserId header
        String jwt = jwtUtils.generateJwtToken(authentication, user.getId());
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        Set<Role> roles = new HashSet<>();
        String requestRole = signUpRequest.getRole();
        if (requestRole != null && requestRole.equalsIgnoreCase("RETAILER")) {
            roles.add(roleRepository.findByName(RoleName.ROLE_RETAILER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found.")));
        } else {
            roles.add(roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found.")));
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("roles", u.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()));
            return map;
        }).collect(Collectors.toList()));
    }
}
