package com.fashion.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Long categoryId;
    private Long brandId;
    private String thumbnailUrl;
    private Boolean isActive = true;
    private Boolean isFeatured = false;
    private Boolean isNewArrival = false;
    private List<String> imageUrls;  // For backward compatibility
    private List<ImageRequest> images;  // ← NEW: Support color-specific images
    private List<VariantRequest> variants;

    // ───────────────── IMAGE REQUEST ─────────────────
    @Data
    public static class ImageRequest {
        private Long id;
        private String imageUrl;
        private String color;  // Map to specific color (optional)
        private Integer displayOrder;
        private Boolean isPrimary;
    }

    @Data
    public static class VariantRequest {
        private Long id;
        private String size;
        private String color;
        private String colorHex;
        private Integer stock;
        private String sku;
    }
}