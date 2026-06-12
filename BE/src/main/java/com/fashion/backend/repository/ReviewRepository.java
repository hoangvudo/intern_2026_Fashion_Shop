package com.fashion.backend.repository;

import com.fashion.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy review của sản phẩm (chỉ visible)
    Page<Review> findByProductIdAndIsVisibleTrue(Long productId, Pageable pageable);

    // Lấy tất cả review của sản phẩm (admin)
    Page<Review> findByProductId(Long productId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE (:rating IS NULL OR r.rating = :rating)")
    Page<Review> findAllWithFilter(@Param("rating") Integer rating, Pageable pageable);

    // Kiểm tra user đã review cho đơn hàng + sản phẩm này chưa
    boolean existsByProductIdAndUserIdAndOrderId(Long productId, Long userId, Long orderId);

    // Tính lại avgRating
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.isVisible = true")
    Double avgRatingByProductId(@Param("productId") Long productId);

    // Đếm review visible
    long countByProductIdAndIsVisibleTrue(Long productId);

    // Lấy review của 1 user cho 1 sản phẩm (có thể nhiều nếu nhiều đơn)
    Page<Review> findByProductIdAndUserId(Long productId, Long userId, Pageable pageable);

    // Review của user (my reviews)
    Page<Review> findByUserId(Long userId, Pageable pageable);

    // Tìm review theo id + user (để check ownership khi sửa/xoá)
    Optional<Review> findByIdAndUserId(Long id, Long userId);
}