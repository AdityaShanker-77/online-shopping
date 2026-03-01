package com.shoppe.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    @Size(max = 20)
    private String phone;
    private String address;
    private String profilePictureUrl;
}
