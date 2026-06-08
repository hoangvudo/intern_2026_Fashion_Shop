package com.fashion.backend.controller;

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

    @GetMapping
    public ResponseEntity<List<Brand>> getAll() {

        return ResponseEntity.ok(
                brandService.getActive()
        );
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Brand>> getAllAdmin() {

        return ResponseEntity.ok(
                brandService.getAll()
        );
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Brand> create(
            @RequestBody Brand brand
    ) {

        return ResponseEntity.ok(
                brandService.create(brand)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Brand> update(
            @PathVariable Long id,
            @RequestBody Brand brand
    ) {

        return ResponseEntity.ok(
                brandService.update(id, brand)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        brandService.delete(id);

        return ResponseEntity.noContent().build();
    }
}