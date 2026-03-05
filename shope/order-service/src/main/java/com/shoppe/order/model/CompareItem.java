package com.shoppe.order.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compare_items", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "product_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompareItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", length = 200)
    private String productName;

    @Column(name = "image_url", length = 10000000)
    private String imageUrl;

    @Column(name = "price")
    private Double price;

    @Column(name = "category")
    private String category;
}
