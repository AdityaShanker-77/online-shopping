package com.shoppe.user.controller;

import com.shoppe.user.dto.UserProfileDto;
import com.shoppe.user.model.UserProfile;
import com.shoppe.user.repository.UserProfileRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserProfileRepository userProfileRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(
            @RequestHeader("X-Auth-User") String email,
            @RequestHeader(value = "X-Auth-UserId", required = false) String userIdStr) {

        Long userId = parseUserId(userIdStr);
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setEmail(email);
                    p.setUserId(userId);
                    return userProfileRepository.save(p);
                });
        // If profile exists but userId was null (old profile), update it
        if (profile.getUserId() == null && userId != null) {
            profile.setUserId(userId);
            profile = userProfileRepository.save(profile);
        }
        return ResponseEntity.ok(toDto(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateProfile(
            @RequestHeader("X-Auth-User") String email,
            @RequestHeader(value = "X-Auth-UserId", required = false) String userIdStr,
            @Valid @RequestBody UserProfileDto dto) {
        Long userId = parseUserId(userIdStr);
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setEmail(email);
                    p.setUserId(userId);
                    return p;
                });
        profile.setFullName(dto.getFullName());
        profile.setPhone(dto.getPhone());
        profile.setAddress(dto.getAddress());
        if (profile.getUserId() == null) profile.setUserId(userId);
        return ResponseEntity.ok(toDto(userProfileRepository.save(profile)));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDto> getByUserId(@PathVariable Long userId) {
        return userProfileRepository.findByUserId(userId)
                .map(p -> ResponseEntity.ok(toDto(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    private Long parseUserId(String userIdStr) {
        try { return userIdStr != null && !userIdStr.isEmpty() ? Long.parseLong(userIdStr) : null; }
        catch (NumberFormatException e) { return null; }
    }

    private UserProfileDto toDto(UserProfile p) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUserId());
        dto.setFullName(p.getFullName());
        dto.setEmail(p.getEmail());
        dto.setPhone(p.getPhone());
        dto.setAddress(p.getAddress());
        return dto;
    }
}
