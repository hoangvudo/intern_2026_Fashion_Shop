package com.fashion.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fashion.backend.entity.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProductResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;

    private BigDecimal price;
    private BigDecimal salePrice;

    private Long categoryId;
    private String categoryName;
    private String categorySlug;

    private Long brandId;
    private String brandName;
    private String brandSlug;

    private String thumbnailUrl;
    private String imageUrl2;
    private List<String> imageUrls;

    private Integer totalStock;
    private Double avgRating;
    private Integer reviewCount;
    private Integer soldCount;

    // Dùng @JsonProperty để Jackson không bỏ prefix "is"
    // Boolean getter → isActive() → Jackson mặc định serialize thành "active"
    @JsonProperty("isActive")
    private Boolean isActive;

    @JsonProperty("isFeatured")
    private Boolean isFeatured;

    @JsonProperty("isNewArrival")
    private Boolean isNewArrival;

    private List<VariantDto> variants;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class VariantDto {
        private Long id;
        private String size;
        private String color;
        private String colorHex;
        private Integer stock;
        private String sku;
    }

    public static ProductResponse from(Product p) {

        ProductResponse r = new ProductResponse();

        r.setId(p.getId());
        r.setName(p.getName());
        r.setSlug(p.getSlug());
        r.setDescription(p.getDescription());

        r.setPrice(p.getPrice());
        r.setSalePrice(p.getSalePrice());

        r.setThumbnailUrl(p.getThumbnailUrl());

        // NEW
        r.setImageUrl2(p.getImageUrl2());

        r.setTotalStock(p.getTotalStock());
        r.setAvgRating(p.getAvgRating());
        r.setReviewCount(p.getReviewCount());
        r.setSoldCount(p.getSoldCount());

        r.setIsActive(p.getIsActive());
        r.setIsFeatured(p.getIsFeatured());
        r.setIsNewArrival(p.getIsNewArrival());

        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());

        if (p.getCategory() != null) {
            r.setCategoryId(p.getCategory().getId());
            r.setCategoryName(p.getCategory().getName());
            r.setCategorySlug(p.getCategory().getSlug());
        }

        if (p.getBrand() != null) {
            r.setBrandId(p.getBrand().getId());
            r.setBrandName(p.getBrand().getName());
            r.setBrandSlug(p.getBrand().getSlug());
        }

        if (p.getImages() != null) {
            r.setImageUrls(
                    p.getImages()
                            .stream()
                            .map(img -> img.getImageUrl())
                            .collect(Collectors.toList())
            );
        }

        if (p.getVariants() != null) {
            r.setVariants(
                    p.getVariants()
                            .stream()
                            .map(v -> {
                                VariantDto vd = new VariantDto();

                                vd.setId(v.getId());
                                vd.setSize(v.getSize());
                                vd.setColor(v.getColor());
                                vd.setColorHex(v.getColorHex());
                                vd.setStock(v.getStock());
                                vd.setSku(v.getSku());

                                return vd;
                            })
                            .collect(Collectors.toList())
            );
        }

        return r;
    }
}