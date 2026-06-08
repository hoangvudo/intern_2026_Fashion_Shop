package com.fashion.backend.repository;

import com.fashion.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    // ─────────────────────────────────────────────────────────────────────────
    //  Existing queries (giữ nguyên)
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    //  NEW: Filter by category + multi-filter (color / size / brand / price)
    //
    //  Logic:
    //  - Nếu colors/sizes không rỗng → JOIN variants và lọc theo điều kiện
    //  - :colorCount / :sizeCount = 0 có nghĩa "không lọc theo trường đó"
    //  - countQuery tách riêng để Spring Data không wrap toàn bộ JOIN vào COUNT(*)
    // ─────────────────────────────────────────────────────────────────────────

    @Query(value = """
        SELECT DISTINCT p FROM Product p
        LEFT JOIN p.variants v
        WHERE p.isActive = true
          AND p.category.id = :categoryId
          AND (:brandId     IS NULL OR p.brand.id = :brandId)
          AND (:minPrice    IS NULL OR p.price >= :minPrice)
          AND (:maxPrice    IS NULL OR p.price <= :maxPrice)
          AND (:isFeatured  IS NULL OR p.isFeatured  = :isFeatured)
          AND (:isNewArrival IS NULL OR p.isNewArrival = :isNewArrival)
          AND (:colorCount  = 0     OR v.color IN :colors)
          AND (:sizeCount   = 0     OR v.size  IN :sizes)
        """,
            countQuery = """
        SELECT COUNT(DISTINCT p.id) FROM Product p
        LEFT JOIN p.variants v
        WHERE p.isActive = true
          AND p.category.id = :categoryId
          AND (:brandId     IS NULL OR p.brand.id = :brandId)
          AND (:minPrice    IS NULL OR p.price >= :minPrice)
          AND (:maxPrice    IS NULL OR p.price <= :maxPrice)
          AND (:isFeatured  IS NULL OR p.isFeatured  = :isFeatured)
          AND (:isNewArrival IS NULL OR p.isNewArrival = :isNewArrival)
          AND (:colorCount  = 0     OR v.color IN :colors)
          AND (:sizeCount   = 0     OR v.size  IN :sizes)
        """)
    Page<Product> filterByCategory(
            @Param("categoryId")   Long categoryId,
            @Param("brandId")      Long brandId,
            @Param("minPrice")     BigDecimal minPrice,
            @Param("maxPrice")     BigDecimal maxPrice,
            @Param("isFeatured")   Boolean isFeatured,
            @Param("isNewArrival") Boolean isNewArrival,
            @Param("colors")       List<String> colors,
            @Param("colorCount")   int colorCount,
            @Param("sizes")        List<String> sizes,
            @Param("sizeCount")    int sizeCount,
            Pageable pageable
    );

    // ─────────────────────────────────────────────────────────────────────────
    //  NEW: Facets — Color
    //  Trả về [color, colorHex, count] cho tất cả variant thuộc category
    // ─────────────────────────────────────────────────────────────────────────

    @Query("""
        SELECT v.color, MIN(v.colorHex), COUNT(DISTINCT p.id)
        FROM Product p
        JOIN p.variants v
        WHERE p.isActive = true
          AND p.category.id = :categoryId
          AND v.color IS NOT NULL
        GROUP BY v.color
        ORDER BY v.color
        """)
    List<Object[]> findColorFacets(@Param("categoryId") Long categoryId);

    // ─────────────────────────────────────────────────────────────────────────
    //  NEW: Facets — Size
    // ─────────────────────────────────────────────────────────────────────────

    @Query("""
        SELECT v.size, COUNT(DISTINCT p.id)
        FROM Product p
        JOIN p.variants v
        WHERE p.isActive = true
          AND p.category.id = :categoryId
          AND v.size IS NOT NULL
        GROUP BY v.size
        ORDER BY v.size
        """)
    List<Object[]> findSizeFacets(@Param("categoryId") Long categoryId);

    // ─────────────────────────────────────────────────────────────────────────
    //  NEW: Facets — Brand
    // ─────────────────────────────────────────────────────────────────────────

    @Query("""
        SELECT p.brand.id, p.brand.name, COUNT(p.id)
        FROM Product p
        WHERE p.isActive = true
          AND p.category.id = :categoryId
          AND p.brand IS NOT NULL
        GROUP BY p.brand.id, p.brand.name
        ORDER BY p.brand.name
        """)
    List<Object[]> findBrandFacets(@Param("categoryId") Long categoryId);

    // ─────────────────────────────────────────────────────────────────────────
    //  NEW: Facets — Price range (min/max của category)
    // ─────────────────────────────────────────────────────────────────────────

    @Query("""
        SELECT MIN(p.price), MAX(p.price)
        FROM Product p
        WHERE p.isActive = true
          AND p.category.id = :categoryId
        """)
    Object[] findPriceRange(@Param("categoryId") Long categoryId);

    // ─────────────────────────────────────────────────────────────────────────
    //  NEW: Get product detail (for public view - only active products)
    //  Loads variants and images with eager loading to avoid N+1
    // ─────────────────────────────────────────────────────────────────────────

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.variants
        LEFT JOIN FETCH p.images
        WHERE p.id = :id AND p.isActive = true
        """)
    Optional<Product> findByIdWithDetails(@Param("id") Long id);
}