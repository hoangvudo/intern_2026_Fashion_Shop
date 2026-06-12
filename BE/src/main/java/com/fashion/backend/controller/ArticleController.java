package com.fashion.backend.controller;

import com.fashion.backend.dto.ArticleRequest;
import com.fashion.backend.dto.ArticleResponse;
import com.fashion.backend.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    // ── PUBLIC ────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<Page<ArticleResponse>> getPublished(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        return ResponseEntity.ok(articleService.getPublished(keyword, category, page, size));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ArticleResponse>> getFeatured() {
        return ResponseEntity.ok(articleService.getFeatured());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ArticleResponse>> getRecent() {
        return ResponseEntity.ok(articleService.getRecent());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ArticleResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(articleService.getBySlug(slug));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementView(@PathVariable Long id) {
        articleService.incrementView(id);
        return ResponseEntity.ok().build();
    }

    // ── ADMIN ─────────────────────────────────────────────────────

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<ArticleResponse>> adminSearch(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(articleService.adminSearch(keyword, category, isPublished, page, size));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ArticleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ArticleResponse> create(@RequestBody ArticleRequest req) {
        return ResponseEntity.ok(articleService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ArticleResponse> update(@PathVariable Long id, @RequestBody ArticleRequest req) {
        return ResponseEntity.ok(articleService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        articleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-publish")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ArticleResponse> togglePublish(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.togglePublish(id));
    }
}