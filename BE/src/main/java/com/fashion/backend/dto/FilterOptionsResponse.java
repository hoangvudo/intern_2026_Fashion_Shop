package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class FilterOptionsResponse {

    private List<ColorFacet>  colors;
    private List<SizeFacet>   sizes;
    private List<BrandFacet>  brands;
    private PriceRange        priceRange;

    // ── Nested facet types ────────────────────────────────────

    @Data
    @AllArgsConstructor
    public static class ColorFacet {
        private String color;
        private String colorHex;   // lấy colorHex đại diện (first)
        private long   count;      // số variant có màu này trong danh mục
    }

    @Data
    @AllArgsConstructor
    public static class SizeFacet {
        private String size;
        private long   count;
    }

    @Data
    @AllArgsConstructor
    public static class BrandFacet {
        private Long   id;
        private String name;
        private long   count;      // số product thuộc brand trong danh mục
    }

    @Data
    @AllArgsConstructor
    public static class PriceRange {
        private BigDecimal min;
        private BigDecimal max;
    }
}