package com.fashion.backend.controller;

import com.fashion.backend.entity.Category;
import com.fashion.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getActive() {
        return ResponseEntity.ok(categoryService.getActive());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PostMapping
    public ResponseEntity<Category> create(
            @RequestBody Category category
    ) {
        return ResponseEntity.ok(
                categoryService.create(category)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(
            @PathVariable Long id,
            @RequestBody Category category
    ) {
        return ResponseEntity.ok(
                categoryService.update(id, category)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        categoryService.delete(id);

        return ResponseEntity.noContent().build();
    }
}