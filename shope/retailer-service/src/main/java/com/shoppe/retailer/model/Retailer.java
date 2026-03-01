package com.shoppe.retailer.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "retailers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Retailer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // userId from auth-service — plain Long, no JPA cross-service join
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "store_name", nullable = false, length = 150)
    private String storeName;

    @Column(length = 150)
    private String email;

    @Column(precision = 15, scale = 2)
    private BigDecimal revenue = BigDecimal.ZERO;

    @Column(name = "is_approved")
    private boolean isApproved = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
