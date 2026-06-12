package com.fashion.backend.dto;

import lombok.Data;

@Data
public class BrandRequest {
    private String name;
    private String slug;
    private String logoUrl;
    private String description;
    private Boolean isActive = true;
}