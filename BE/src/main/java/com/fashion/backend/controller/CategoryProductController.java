
package com.fashion.backend.controller;

import com.fashion.backend.dto.CategoryProductFilterRequest;
import com.fashion.backend.dto.FilterOptionsResponse;
import com.fashion.backend.dto.PagedResponse;
import com.fashion.backend.dto.ProductResponse;
import com.fashion.backend.service.CategoryProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories/{categoryId}/products")
@RequiredArgsConstructor
public class CategoryProductController {

    private final CategoryProductService categoryProductService;

    /**
     * GET /api/v1/categories/{categoryId}/products
     *
     * Query params:
     *   brandId, colors (multi), sizes (multi),
     *   minPrice, maxPrice, isFeatured, isNewArrival,
     *   sortBy (newest|price_asc|price_desc|best_selling|top_rated),
     *   page (0-based), size (default 20)
     *
     * Ví dụ:
     *   /api/v1/categories/3/products
     *     ?colors=Đỏ&colors=Xanh
     *     &sizes=M&sizes=L
     *     &brandId=5
     *     &minPrice=100000&maxPrice=500000
     *     &sortBy=price_asc
     *     &page=0&size=20
     */
    @GetMapping
    public ResponseEntity<PagedResponse<ProductResponse>> filterProducts(
            @PathVariable Long categoryId,
            @ModelAttribute CategoryProductFilterRequest req
    ) {
        req.setCategoryId(categoryId);   // inject categoryId từ path vào request
        return ResponseEntity.ok(categoryProductService.filterProducts(req));
    }

    /**
     * GET /api/v1/categories/{categoryId}/products/filter-options
     *
     * Trả về facets: colors (+ hex), sizes, brands, priceRange
     * dùng để render bộ lọc phía FE.
     */
    @GetMapping("/filter-options")
    public ResponseEntity<FilterOptionsResponse> getFilterOptions(
            @PathVariable Long categoryId
    ) {
        return ResponseEntity.ok(categoryProductService.getFilterOptions(categoryId));
    }
}