package com.shoppe.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FakeStoreProductDto {
    private Long id;
    private String title;
    private BigDecimal price;
    private String description;
    private String category;
    private String image;
    private Rating rating;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Rating {
        private Double rate;
        private Integer count;
    }
}
