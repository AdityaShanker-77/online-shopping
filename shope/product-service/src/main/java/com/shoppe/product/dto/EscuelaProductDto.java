package com.shoppe.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EscuelaProductDto {
    private Long id;
    private String title;
    private BigDecimal price;
    private String description;
    private List<String> images;
    private EscuelaCategoryDto category;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EscuelaCategoryDto {
        private Long id;
        private String name;
        private String image;
    }
}
