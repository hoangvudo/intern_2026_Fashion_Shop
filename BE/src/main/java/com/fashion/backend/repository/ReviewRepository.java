package com.fashion.backend.repository;

import com.fashion.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

<<<<<<< Updated upstream
=======
import java.util.List;
>>>>>>> Stashed changes
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

<<<<<<< Updated upstream
    // Lấy review của sản phẩm (chỉ visible)
    Page<Review> findByProductIdAndIsVisibleTrue(Long productId, Pageable pageable);

    // Lấy tất cả review của sản phẩm (admin)
    Page<Review> findByProductId(Long productId, Pageable pageable);
=======
    // Lấy review của sản phẩm (chỉ visible) có lọc rating
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.isVisible = true AND (:rating IS NULL OR r.rating = :rating)")
    Page<Review> findByProductIdAndIsVisibleTrueWithFilter(@Param("productId") Long productId, @Param("rating") Integer rating, Pageable pageable);

    // Lấy tất cả review (admin) có lọc rating
    // JOIN FETCH + Page yêu cầu countQuery riêng, không thì Hibernate báo lỗi
    @Query(
            value = "SELECT r FROM Review r JOIN FETCH r.product p LEFT JOIN FETCH p.images JOIN FETCH r.user u WHERE (:rating IS NULL OR r.rating = :rating)",
            countQuery = "SELECT COUNT(r) FROM Review r WHERE (:rating IS NULL OR r.rating = :rating)"
    )
    Page<Review> adminFindAll(@Param("rating") Integer rating, Pageable pageable);

    // Lấy tất cả review của sản phẩm (admin) có lọc rating
    @Query(
            value = "SELECT r FROM Review r JOIN FETCH r.product p LEFT JOIN FETCH p.images JOIN FETCH r.user u WHERE r.product.id = :productId AND (:rating IS NULL OR r.rating = :rating)",
            countQuery = "SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND (:rating IS NULL OR r.rating = :rating)"
    )
    Page<Review> adminFindByProductId(@Param("productId") Long productId, @Param("rating") Integer rating, Pageable pageable);
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======

    @Query("SELECT r FROM Review r ORDER BY r.createdAt DESC")
    List<Review> findTopRecentReviews(Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double getGlobalAverageRating();
>>>>>>> Stashed changes
}