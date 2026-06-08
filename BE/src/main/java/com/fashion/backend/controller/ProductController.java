package com.fashion.backend.controller;

import com.fashion.backend.dto.ProductRequest;
import com.fashion.backend.dto.ProductResponse;
import com.fashion.backend.repository.ProductVariantRepository;
import com.fashion.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductVariantRepository productVariantRepository;

    // ───────────────── PUBLIC ─────────────────

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> search(

            @RequestParam(required = false) String keyword,

            @RequestParam(required = false) Long categoryId,

            @RequestParam(required = false) Long brandId,

            @RequestParam(required = false) BigDecimal minPrice,

            @RequestParam(required = false) BigDecimal maxPrice,

            @RequestParam(defaultValue = "createdAt") String sortBy,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "12") int size
    ) {

        if ("newest".equals(sortBy)) {
            sortBy = "createdAt";
        }

        return ResponseEntity.ok(
                productService.search(
                        keyword,
                        categoryId,
                        brandId,
                        minPrice,
                        maxPrice,
                        sortBy,
                        page,
                        size
                )
        );
    }

    // ───────────────── DETAIL ─────────────────

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                productService.getById(id)
        );
    }


    // ───────────────── STOCK CHECK (PUBLIC) ─────────────────

    /**
     * GET /api/products/{id}/stock?size=M&color=Đen
     * Trả về stock realtime của 1 variant cụ thể
     */
    @GetMapping("/{id}/stock")
    public ResponseEntity<java.util.Map<String, Object>> getStock(
            @PathVariable Long id,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String color
    ) {
        java.util.Map<String, Object> result = new java.util.LinkedHashMap<>();
        productVariantRepository
                .findByProductIdAndSizeAndColor(id, size, color)
                .ifPresentOrElse(v -> {
                    result.put("stock", v.getStock());
                    result.put("available", v.getStock() > 0);
                }, () -> {
                    // Fallback: tổng stock tất cả variants của sản phẩm
                    int total = productVariantRepository.findByProductId(id)
                            .stream().mapToInt(v -> v.getStock() != null ? v.getStock() : 0).sum();
                    result.put("stock", total);
                    result.put("available", total > 0);
                });
        return ResponseEntity.ok(result);
    }

    // ───────────────── ADMIN ─────────────────

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<ProductResponse>> adminSearch(

            @RequestParam(required = false) String keyword,

            @RequestParam(required = false) Long categoryId,

            @RequestParam(required = false) Long brandId,

            @RequestParam(required = false) Boolean isActive,

            @RequestParam(defaultValue = "createdAt") String sortBy,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size
    ) {

        if ("newest".equals(sortBy)) {
            sortBy = "createdAt";
        }

        return ResponseEntity.ok(
                productService.adminSearch(
                        keyword,
                        categoryId,
                        brandId,
                        isActive,
                        sortBy,
                        page,
                        size
                )
        );
    }

    // ───────────────── CREATE ─────────────────

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ProductResponse> create(
            @RequestBody ProductRequest req
    ) {

        return ResponseEntity.ok(
                productService.create(req)
        );
    }

    // ───────────────── UPDATE ─────────────────

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ProductResponse> update(

            @PathVariable Long id,

            @RequestBody ProductRequest req
    ) {

        return ResponseEntity.ok(
                productService.update(id, req)
        );
    }

    // ───────────────── DELETE ─────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        productService.delete(id);

        return ResponseEntity.noContent().build();
    }

    // ───────────────── TOGGLE ACTIVE ─────────────────

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ProductResponse> toggleActive(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                productService.toggleActive(id)
        );
    }
}