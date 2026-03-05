package com.shoppe.user.controller;

import com.shoppe.user.dto.UserProfileDto;
import com.shoppe.user.model.UserProfile;
import com.shoppe.user.repository.UserProfileRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserProfileRepository userProfileRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(
            @RequestHeader("X-Auth-User") String email,
            @RequestHeader(value = "X-Auth-UserId", required = false) String userIdStr,
            @RequestHeader(value = "X-Auth-Name", required = false) String nameStr) {

        Long userId = parseUserId(userIdStr);
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setEmail(email);
                    p.setUserId(userId);
                    p.setFullName(nameStr);
                    return userProfileRepository.save(p);
                });
        // If profile exists but userId was null (old profile), update it
        if (profile.getUserId() == null && userId != null) {
            profile.setUserId(userId);
            profile = userProfileRepository.save(profile);
        }
        // If profile exists but name is null, sync it from the JWT
        if ((profile.getFullName() == null || profile.getFullName().isEmpty()) && nameStr != null
                && !nameStr.isEmpty()) {
            profile.setFullName(nameStr);
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
        if (dto.getProfilePictureUrl() != null)
            profile.setProfilePictureUrl(dto.getProfilePictureUrl());
        if (profile.getUserId() == null)
            profile.setUserId(userId);
        return ResponseEntity.ok(toDto(userProfileRepository.save(profile)));
    }

    @PostMapping("/me/picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestHeader("X-Auth-User") String email,
            @RequestParam("file") MultipartFile file) throws IOException {
        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("message", "File size must not exceed 2MB"));
        }
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String dataUrl = "data:" + file.getContentType() + ";base64," + base64;
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setProfilePictureUrl(dataUrl);
        userProfileRepository.save(profile);
        return ResponseEntity.ok(Map.of("profilePictureUrl", dataUrl));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDto> getByUserId(@PathVariable Long userId) {
        return userProfileRepository.findByUserId(userId)
                .map(p -> ResponseEntity.ok(toDto(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    private Long parseUserId(String userIdStr) {
        try {
            return userIdStr != null && !userIdStr.isEmpty() ? Long.parseLong(userIdStr) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private UserProfileDto toDto(UserProfile p) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUserId());
        dto.setFullName(p.getFullName());
        dto.setEmail(p.getEmail());
        dto.setPhone(p.getPhone());
        dto.setAddress(p.getAddress());
        dto.setProfilePictureUrl(p.getProfilePictureUrl());
        return dto;
    }
}
