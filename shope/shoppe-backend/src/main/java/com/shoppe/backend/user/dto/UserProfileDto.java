package com.shoppe.backend.user.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private List<String> roles;
    private int wishlistCount;
    private int orderCount;
}
