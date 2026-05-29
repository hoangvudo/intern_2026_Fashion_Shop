    package com.fashion.backend.entity;

    import jakarta.persistence.*;
    import lombok.Data;
    import java.math.BigDecimal;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;

    @Entity
    @Table(name = "products")
    @Data
    public class Product {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String name;

        @Column(unique = true)
        private String slug;

        @Column(columnDefinition = "TEXT")
        private String description;

        @Column(nullable = false, precision = 15, scale = 0)
        private BigDecimal price;

        private BigDecimal salePrice;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "category_id")
        private Category category;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "brand_id")
        private Brand brand;

        private String thumbnailUrl;
        private Integer totalStock = 0;
        private Double avgRating = 0.0;
        private Integer reviewCount = 0;
        private Integer soldCount = 0;
        private Boolean isActive = true;
        private Boolean isFeatured = false;
        private Boolean isNewArrival = false;

        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<ProductImage> images = new ArrayList<>();

        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<ProductVariant> variants = new ArrayList<>();

        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();
    }
