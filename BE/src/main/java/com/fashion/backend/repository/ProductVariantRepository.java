package com.fashion.backend.repository;

import com.fashion.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
    List<ProductVariant> findByProductIdIn(List<Long> productIds);

    @org.springframework.data.jpa.repository.Query(
            "SELECT v FROM ProductVariant v WHERE v.product.id = :productId " +
                    "AND (:size IS NULL OR v.size = :size) " +
                    "AND (:color IS NULL OR v.color = :color)"
    )
    java.util.Optional<ProductVariant> findByProductIdAndSizeAndColor(
            @org.springframework.data.repository.query.Param("productId") Long productId,
            @org.springframework.data.repository.query.Param("size") String size,
            @org.springframework.data.repository.query.Param("color") String color
    );
    Long countByStockLessThan(int threshold);

    @org.springframework.data.jpa.repository.Query(
            "SELECT DISTINCT v FROM ProductVariant v JOIN FETCH v.product p " +
                    "WHERE v.stock < :threshold ORDER BY v.stock ASC"
    )
    List<ProductVariant> findLowStockVariants(@org.springframework.data.repository.query.Param("threshold") int threshold);
}