package com.fashion.backend.controller;

import com.fashion.backend.dto.BrandResponse;
import com.fashion.backend.entity.Brand;
import com.fashion.backend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    /** GET /api/brands — public, brand active */
    @GetMapping
    public ResponseEntity<List<BrandResponse>> getActive() {
        return ResponseEntity.ok(brandService.getActive());
    }

    /** GET /api/brands/slug/{slug} — public */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<BrandResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(brandService.getBySlug(slug));
    }

    /** GET /api/brands/{id} — public */
    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getById(id));
    }

    /** GET /api/brands/all — admin */
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<BrandResponse>> getAll() {
        return ResponseEntity.ok(brandService.getAll());
    }

    /** POST /api/brands — admin */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BrandResponse> create(@RequestBody Brand brand) {
        return ResponseEntity.ok(brandService.create(brand));
    }

    /** PUT /api/brands/{id} — admin */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BrandResponse> update(
            @PathVariable Long id,
            @RequestBody Brand brand
    ) {
        return ResponseEntity.ok(brandService.update(id, brand));
    }

    /** PATCH /api/brands/{id}/toggle-active — admin */
    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BrandResponse> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.toggleActive(id));
    }

    /** DELETE /api/brands/{id} — admin */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        brandService.delete(id);
        return ResponseEntity.noContent().build();
    }
}