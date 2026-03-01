package com.shoppe.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;

    @NotBlank @Size(max = 200)
    private String name;

    private String description;

    @NotNull @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer stock;

    @NotNull
    private Long categoryId;

    private String categoryName;

    @NotNull
    private Long retailerId;

    private String imageUrl;
}
