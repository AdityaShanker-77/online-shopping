package com.shoppe.retailer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class RetailerDto {
    private Long id;
    private Long userId;
    @NotBlank
    private String storeName;
    private String email;
    private BigDecimal revenue;
    private boolean approved;
    private String description;
}
