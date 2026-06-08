package com.fashion.backend.dto;

import com.fashion.backend.entity.Brand;
import lombok.Data;

@Data
public class BrandResponse {

    private Long id;
    private String name;
    private String slug;
    private String logoUrl;
    private String bannerUrl;
    private String description;
    private Boolean isActive;

    // Extra — đếm sản phẩm
    private Long productCount;
    private Long totalProductCount;

    public static BrandResponse from(Brand brand) {
        BrandResponse r = new BrandResponse();
        r.setId(brand.getId());
        r.setName(brand.getName());
        r.setSlug(brand.getSlug());
        r.setLogoUrl(brand.getLogoUrl());
        r.setDescription(brand.getDescription());
        r.setIsActive(brand.getIsActive());
        r.setProductCount(0L);
        r.setTotalProductCount(0L);
        return r;
    }
}