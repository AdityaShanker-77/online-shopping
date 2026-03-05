package com.shoppe.product.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReactBdProductDto {

    @JsonProperty("_id")
    private Long id;

    private String title;
    private BigDecimal price;
    private String oldPrice;
    private BigDecimal discountedPrice;
    private String description;
    private String category;
    private String type;
    private String brand;
    private Integer stock;
    private String image;
    private Integer rating;
    private Boolean isNew;
    private List<String> size;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductListResponse {
        private List<ReactBdProductDto> data;
        private Integer totalProducts;
        private Integer totalPages;
        private Integer currentPage;
        private Integer perPage;
    }
}
