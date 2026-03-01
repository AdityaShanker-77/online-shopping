package com.shoppe.backend.retailer.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RetailerProfileDto {
    private Long id;
    private String storeName;
    private String ownerName;
    private String email;
    private BigDecimal revenue;
    private boolean isApproved;
}
