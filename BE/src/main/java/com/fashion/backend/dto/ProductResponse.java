package com.fashion.backend.dto;

<<<<<<< Updated upstream
import com.fashion.backend.entity.Product;
import lombok.Data;
=======
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fashion.backend.entity.Product;
import lombok.Data;

>>>>>>> Stashed changes
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProductResponse {
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    private Long id;
    private String name;
    private String slug;
    private String description;
<<<<<<< Updated upstream
    private BigDecimal price;
    private BigDecimal salePrice;
    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;
    private String thumbnailUrl;
    private List<String> imageUrls;
=======

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

>>>>>>> Stashed changes
    private Integer totalStock;
    private Double avgRating;
    private Integer reviewCount;
    private Integer soldCount;
<<<<<<< Updated upstream
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isNewArrival;
    private List<VariantDto> variants;
=======

    // Dùng @JsonProperty để Jackson không bỏ prefix "is"
    // Boolean getter → isActive() → Jackson mặc định serialize thành "active"
    @JsonProperty("isActive")
    private Boolean isActive;

    @JsonProperty("isFeatured")
    private Boolean isFeatured;

    @JsonProperty("isNewArrival")
    private Boolean isNewArrival;

    private List<VariantDto> variants;

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        ProductResponse r = new ProductResponse();
=======

        ProductResponse r = new ProductResponse();

>>>>>>> Stashed changes
        r.setId(p.getId());
        r.setName(p.getName());
        r.setSlug(p.getSlug());
        r.setDescription(p.getDescription());
<<<<<<< Updated upstream
        r.setPrice(p.getPrice());
        r.setSalePrice(p.getSalePrice());
        r.setThumbnailUrl(p.getThumbnailUrl());
=======

        r.setPrice(p.getPrice());
        r.setSalePrice(p.getSalePrice());

        r.setThumbnailUrl(p.getThumbnailUrl());

        // NEW
        r.setImageUrl2(p.getImageUrl2());

>>>>>>> Stashed changes
        r.setTotalStock(p.getTotalStock());
        r.setAvgRating(p.getAvgRating());
        r.setReviewCount(p.getReviewCount());
        r.setSoldCount(p.getSoldCount());
<<<<<<< Updated upstream
        r.setIsActive(p.getIsActive());
        r.setIsFeatured(p.getIsFeatured());
        r.setIsNewArrival(p.getIsNewArrival());
=======

        r.setIsActive(p.getIsActive());
        r.setIsFeatured(p.getIsFeatured());
        r.setIsNewArrival(p.getIsNewArrival());

>>>>>>> Stashed changes
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());

        if (p.getCategory() != null) {
            r.setCategoryId(p.getCategory().getId());
            r.setCategoryName(p.getCategory().getName());
<<<<<<< Updated upstream
        }
        if (p.getBrand() != null) {
            r.setBrandId(p.getBrand().getId());
            r.setBrandName(p.getBrand().getName());
        }
        if (p.getImages() != null) {
            r.setImageUrls(p.getImages().stream()
                    .map(img -> img.getImageUrl()).collect(Collectors.toList()));
        }
        if (p.getVariants() != null) {
            r.setVariants(p.getVariants().stream().map(v -> {
                VariantDto vd = new VariantDto();
                vd.setId(v.getId());
                vd.setSize(v.getSize());
                vd.setColor(v.getColor());
                vd.setColorHex(v.getColorHex());
                vd.setStock(v.getStock());
                vd.setSku(v.getSku());
                return vd;
            }).collect(Collectors.toList()));
        }
        return r;
    }
}
=======
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
>>>>>>> Stashed changes
