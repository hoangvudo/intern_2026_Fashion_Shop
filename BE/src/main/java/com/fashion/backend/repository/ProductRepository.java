package com.fashion.backend.repository;

import com.fashion.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
<<<<<<< Updated upstream
import java.math.BigDecimal;
=======

import java.math.BigDecimal;
import java.util.List;
>>>>>>> Stashed changes
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

<<<<<<< Updated upstream
    @Query("""
        SELECT p FROM Product p
        WHERE p.isActive = true
          AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:keyword,'%')))
=======
    // ── PUBLIC SEARCH ─────────────────────────────────────────────
    // JOIN FETCH category và brand để tránh LazyInitializationException
    // Dùng countQuery riêng vì COUNT không cần fetch relations
    @Query(value = """
        SELECT p FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.brand
        WHERE p.isActive = true
          AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:categoryId IS NULL OR p.category.id = :categoryId)
          AND (:brandId IS NULL OR p.brand.id = :brandId)
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
    """,
            countQuery = """
        SELECT COUNT(p) FROM Product p
        WHERE p.isActive = true
          AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:keyword,'%')))
=======
    // ── ADMIN SEARCH ──────────────────────────────────────────────
    // JOIN FETCH để load category + brand cùng 1 query, không bị null
    @Query(value = """
        SELECT p FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.brand
        WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:categoryId IS NULL OR p.category.id = :categoryId)
          AND (:brandId IS NULL OR p.brand.id = :brandId)
          AND (:isActive IS NULL OR p.isActive = :isActive)
    """,
            countQuery = """
        SELECT COUNT(p) FROM Product p
        WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    Page<Product> findByIsActiveTrueAndIsFeaturedTrue(Pageable pageable);
    Page<Product> findByIsActiveTrueAndIsNewArrivalTrue(Pageable pageable);
    long countByIsActiveTrue();
}
=======
    // ── SINGLE FETCH with relations ───────────────────────────────
    // Dùng cho getById() — load đầy đủ category, brand, variants, images
    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.brand
        LEFT JOIN FETCH p.variants
        WHERE p.id = :id
    """)
    Optional<Product> findByIdWithRelations(@Param("id") Long id);

    Page<Product> findByIsActiveTrueAndIsFeaturedTrue(Pageable pageable);

    Page<Product> findByIsActiveTrueAndIsNewArrivalTrue(Pageable pageable);

    long countByIsActiveTrue();

    List<Product> findTop8ByIsActiveTrueOrderByCreatedAtDesc();

    List<Product> findTop8ByIsActiveTrueOrderBySoldCountDesc();

    List<Product> findTop8ByIsActiveTrueAndIsFeaturedTrueOrderByCreatedAtDesc();

    List<Product> findTop8ByIsActiveTrueAndIsNewArrivalTrueOrderByCreatedAtDesc();

    @Query("""
        SELECT p FROM Product p
        WHERE p.isActive = true
        ORDER BY p.avgRating DESC
    """)
    List<Product> findTopRatedProducts(Pageable pageable);
}
>>>>>>> Stashed changes
