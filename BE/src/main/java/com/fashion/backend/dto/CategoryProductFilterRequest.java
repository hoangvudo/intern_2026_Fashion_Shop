package com.fashion.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CategoryProductFilterRequest {

    // ── Filters ──────────────────────────────────────────────
    private Long categoryId;          // bắt buộc (có thể truyền qua PathVariable thay vì body)
    private Long brandId;
    private List<String> colors;      // e.g. ["Đỏ","Xanh"]
    private List<String> sizes;       // e.g. ["S","M","L"]
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    // Flags
    private Boolean isFeatured;
    private Boolean isNewArrival;

    // ── Sorting ───────────────────────────────────────────────
    // Accepted values: price_asc | price_desc | newest | best_selling | top_rated
    private String sortBy = "newest";

    // ── Pagination (offset-based) ─────────────────────────────
    private int page = 0;
    private int size = 20;
}