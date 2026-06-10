package com.fashion.backend.service;

import com.fashion.backend.dto.ReviewRequest;
import com.fashion.backend.dto.ReviewResponse;
import com.fashion.backend.entity.Product;
import com.fashion.backend.entity.Review;
import com.fashion.backend.entity.User;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.ProductRepository;
import com.fashion.backend.repository.ReviewRepository;
import com.fashion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository   userRepository;

    // ── PUBLIC: lấy review của sản phẩm ──────────────────────────
    public Page<ReviewResponse> getByProduct(Long productId, Integer rating, int page, int size, String sortBy) {
        Sort sort = switch (sortBy == null ? "newest" : sortBy) {
            case "rating_desc" -> Sort.by("rating").descending();
            case "rating_asc"  -> Sort.by("rating").ascending();
            default            -> Sort.by("createdAt").descending();
        };
        Pageable pageable = PageRequest.of(page, size, sort);
        return reviewRepository
                .findByProductIdAndIsVisibleTrueWithFilter(productId, rating, pageable)
                .map(ReviewResponse::from);
    }

    // ── USER: tạo review ──────────────────────────────────────────
    @Transactional
    public ReviewResponse create(Long productId, String email, ReviewRequest req) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + productId));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

        // Nếu có orderId: kiểm tra không review trùng cùng đơn + sản phẩm
        if (req.getOrderId() != null) {
            boolean alreadyReviewed = reviewRepository
                    .existsByProductIdAndUserIdAndOrderId(productId, user.getId(), req.getOrderId());
            if (alreadyReviewed) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "Bạn đã đánh giá sản phẩm này cho đơn hàng đó rồi");
            }
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setOrderId(req.getOrderId());
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setIsVisible(true);
        if (req.getImageUrls() != null) {
            review.setImageUrls(req.getImageUrls());
        }
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        reviewRepository.save(review);

        // Cập nhật avgRating + reviewCount trên Product
        recalcProduct(product);

        return ReviewResponse.from(review);
    }

    // ── USER: sửa review của mình ─────────────────────────────────
    @Transactional
    public ReviewResponse update(Long reviewId, String email, ReviewRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

        Review review = reviewRepository.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Bạn không có quyền sửa review này"));

        review.setRating(req.getRating());
        review.setComment(req.getComment());
        if (req.getImageUrls() != null) {
            review.setImageUrls(req.getImageUrls());
        }
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);

        recalcProduct(review.getProduct());

        return ReviewResponse.from(review);
    }

    // ── USER: xoá review của mình ─────────────────────────────────
    @Transactional
    public void delete(Long reviewId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

        Review review = reviewRepository.findByIdAndUserId(reviewId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Bạn không có quyền xoá review này"));

        Product product = review.getProduct();
        reviewRepository.delete(review);
        recalcProduct(product);
    }

    // ── USER: review của tôi ──────────────────────────────────────
    public Page<ReviewResponse> getMyReviews(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.findByUserId(user.getId(), pageable).map(ReviewResponse::from);
    }

    // ── ADMIN: lấy tất cả review (kể cả ẩn) ──────────────────────
    @Transactional(readOnly = true)
    public Page<ReviewResponse> adminGetAll(Integer rating, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.adminFindAll(rating, pageable).map(ReviewResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> adminGetByProduct(Long productId, Integer rating, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.adminFindByProductId(productId, rating, pageable).map(ReviewResponse::from);
    }

    // ── ADMIN: ẩn / hiện review ───────────────────────────────────
    @Transactional
    public ReviewResponse toggleVisible(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Review không tồn tại: " + reviewId));

        review.setIsVisible(!review.getIsVisible());
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);

        recalcProduct(review.getProduct());

        return ReviewResponse.from(review);
    }

    // ── ADMIN: xoá review ─────────────────────────────────────────
    @Transactional
    public void adminDelete(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Review không tồn tại: " + reviewId));

        Product product = review.getProduct();
        reviewRepository.delete(review);
        recalcProduct(product);
    }

    // ── Tính lại avgRating + reviewCount ─────────────────────────
    private void recalcProduct(Product product) {
        Double avg   = reviewRepository.avgRatingByProductId(product.getId());
        long   count = reviewRepository.countByProductIdAndIsVisibleTrue(product.getId());
        product.setAvgRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        product.setReviewCount((int) count);
        productRepository.save(product);
    }
}