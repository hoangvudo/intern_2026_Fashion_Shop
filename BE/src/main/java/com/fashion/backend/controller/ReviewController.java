package com.fashion.backend.controller;

import com.fashion.backend.dto.ReviewRequest;
import com.fashion.backend.dto.ReviewResponse;
import com.fashion.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ── PUBLIC: lấy review của sản phẩm ──────────────────────────
    // GET /api/products/{productId}/reviews
    @GetMapping("/api/products/{productId}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getByProduct(
            @PathVariable Long productId,
<<<<<<< Updated upstream
=======
            @RequestParam(required = false)        Integer rating,
>>>>>>> Stashed changes
            @RequestParam(defaultValue = "0")      int page,
            @RequestParam(defaultValue = "10")     int size,
            @RequestParam(defaultValue = "newest") String sortBy
    ) {
<<<<<<< Updated upstream
        return ResponseEntity.ok(reviewService.getByProduct(productId, page, size, sortBy));
=======
        return ResponseEntity.ok(reviewService.getByProduct(productId, rating, page, size, sortBy));
>>>>>>> Stashed changes
    }

    // ── USER: tạo review ──────────────────────────────────────────
    // POST /api/products/{productId}/reviews
    @PostMapping("/api/products/{productId}/reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> create(
            @PathVariable Long productId,
            @AuthenticationPrincipal String email,  // JwtFilter set principal = email
            @Valid @RequestBody ReviewRequest req
    ) {
        return ResponseEntity.ok(reviewService.create(productId, email, req));
    }

    // ── USER: sửa review ──────────────────────────────────────────
    // PUT /api/reviews/{reviewId}
    @PutMapping("/api/reviews/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> update(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ReviewRequest req
    ) {
        return ResponseEntity.ok(reviewService.update(reviewId, email, req));
    }

    // ── USER: xoá review ──────────────────────────────────────────
    // DELETE /api/reviews/{reviewId}
    @DeleteMapping("/api/reviews/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal String email
    ) {
        reviewService.delete(reviewId, email);
        return ResponseEntity.noContent().build();
    }

    // ── USER: review của tôi ──────────────────────────────────────
    // GET /api/reviews/me
    @GetMapping("/api/reviews/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ReviewResponse>> getMyReviews(
            @AuthenticationPrincipal String email,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getMyReviews(email, page, size));
    }

    // ── ADMIN: lấy tất cả review (kể cả ẩn) ──────────────────────
<<<<<<< Updated upstream
=======
    // GET /api/admin/reviews
    @GetMapping("/api/admin/reviews")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<ReviewResponse>> adminGetAll(
            @RequestParam(required = false)    Integer rating,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.adminGetAll(rating, page, size));
    }

>>>>>>> Stashed changes
    // GET /api/admin/products/{productId}/reviews
    @GetMapping("/api/admin/products/{productId}/reviews")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<ReviewResponse>> adminGetByProduct(
            @PathVariable Long productId,
<<<<<<< Updated upstream
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.adminGetByProduct(productId, page, size));
=======
            @RequestParam(required = false)    Integer rating,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.adminGetByProduct(productId, rating, page, size));
>>>>>>> Stashed changes
    }

    // ── ADMIN: ẩn / hiện review ───────────────────────────────────
    // PATCH /api/admin/reviews/{reviewId}/toggle-visible
    @PatchMapping("/api/admin/reviews/{reviewId}/toggle-visible")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ReviewResponse> toggleVisible(
            @PathVariable Long reviewId
    ) {
        return ResponseEntity.ok(reviewService.toggleVisible(reviewId));
    }

    // ── ADMIN: xoá review ─────────────────────────────────────────
    // DELETE /api/admin/reviews/{reviewId}
    @DeleteMapping("/api/admin/reviews/{reviewId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> adminDelete(
            @PathVariable Long reviewId
    ) {
        reviewService.adminDelete(reviewId);
        return ResponseEntity.noContent().build();
    }
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
