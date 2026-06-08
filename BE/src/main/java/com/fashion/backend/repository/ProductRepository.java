package com.fashion.backend.repository;

import com.fashion.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    @Query("""
        SELECT p FROM Product p
        WHERE p.isActive = true
          AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:keyword,'%')))
          AND (:categoryId IS NULL OR p.category.id = :categoryId)
          AND (:brandId IS NULL OR p.brand.id = :brandId)
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
    """)
    Page<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:keyword,'%')))
          AND (:categoryId IS NULL OR p.category.id = :categoryId)
          AND (:brandId IS NULL OR p.brand.id = :brandId)
          AND (:isActive IS NULL OR p.isActive = :isActive)
    """)
    Page<Product> adminSearchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );

    Page<Product> findByIsActiveTrueAndIsFeaturedTrue(Pageable pageable);
    Page<Product> findByIsActiveTrueAndIsNewArrivalTrue(Pageable pageable);
    long countByIsActiveTrue();
}
