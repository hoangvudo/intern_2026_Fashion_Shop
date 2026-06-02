package com.fashion.backend.dto;

import com.fashion.backend.entity.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Data
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;
    private String thumbnailUrl;
    private Integer totalStock;
    private Double avgRating;
    private Integer reviewCount;
    private Integer soldCount;
    private Integer viewCount;
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isNewArrival;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Group variants by color with their images
    private Map<String, ColorVariantGroup> colorVariants;

    @Data
    public static class ColorVariantGroup {
        private String color;              // Tên màu (e.g., "Red", "Blue")
        private String colorHex;           // Mã hex (e.g., "#FF0000")
        private List<String> images;       // Ảnh cho màu này
        private List<SizeVariant> sizes;   // Các size cho màu này

        @Data
        public static class SizeVariant {
            private Long id;
            private String size;
            private Integer stock;
            private String sku;
        }
    }

    public static ProductDetailResponse from(Product p) {
        ProductDetailResponse r = new ProductDetailResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setSlug(p.getSlug());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setSalePrice(p.getSalePrice());
        r.setThumbnailUrl(p.getThumbnailUrl());
        r.setTotalStock(p.getTotalStock());
        r.setAvgRating(p.getAvgRating());
        r.setReviewCount(p.getReviewCount());
        r.setSoldCount(p.getSoldCount());
        r.setViewCount(p.getViewCount() != null ? p.getViewCount() : 0);
        r.setIsActive(p.getIsActive());
        r.setIsFeatured(p.getIsFeatured());
        r.setIsNewArrival(p.getIsNewArrival());
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());

        if (p.getCategory() != null) {
            r.setCategoryId(p.getCategory().getId());
            r.setCategoryName(p.getCategory().getName());
        }
        if (p.getBrand() != null) {
            r.setBrandId(p.getBrand().getId());
            r.setBrandName(p.getBrand().getName());
        }

        // Group variants by color
        if (p.getVariants() != null && !p.getVariants().isEmpty()) {
            Map<String, ColorVariantGroup> colorMap = new LinkedHashMap<>();

            // Group variants by color
            p.getVariants().forEach(variant -> {
                String colorKey = variant.getColor() != null ? variant.getColor() : "default";
                colorMap.computeIfAbsent(colorKey, k -> {
                    ColorVariantGroup group = new ColorVariantGroup();
                    group.setColor(variant.getColor());
                    group.setColorHex(variant.getColorHex());
                    group.setImages(new ArrayList<>());
                    group.setSizes(new ArrayList<>());
                    return group;
                });

                // Add size variant
                ColorVariantGroup.SizeVariant sizeVar = new ColorVariantGroup.SizeVariant();
                sizeVar.setId(variant.getId());
                sizeVar.setSize(variant.getSize());
                sizeVar.setStock(variant.getStock());
                sizeVar.setSku(variant.getSku());
                colorMap.get(colorKey).getSizes().add(sizeVar);
            });

            // Map images to colors
            if (p.getImages() != null && !p.getImages().isEmpty()) {
                p.getImages().forEach(image -> {
                    String colorKey = image.getColor() != null ? image.getColor() : "default";
                    if (colorMap.containsKey(colorKey)) {
                        colorMap.get(colorKey).getImages().add(image.getImageUrl());
                    }
                });
            }

            r.setColorVariants(colorMap);
        }

        return r;
    }
}
