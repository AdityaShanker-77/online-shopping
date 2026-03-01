package com.shoppe.order.dto;

import lombok.Data;
import java.math.BigDecimal;

// Mirror of ProductDto from product-service (used only for Feign client calls)
@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Long categoryId;
    private String categoryName;
    private Long retailerId;
    private String imageUrl;
}
