package com.fashion.backend.repository;

import com.fashion.backend.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findBySlug(String slug);

    List<Brand> findByIsActiveTrueOrderByNameAsc();

    List<Brand> findAllByOrderByNameAsc();

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    // Đếm số sản phẩm (active) của từng brand
    @Query("SELECT COUNT(p) FROM Product p WHERE p.brand.id = :brandId AND p.isActive = true")
    long countActiveProductsByBrandId(@Param("brandId") Long brandId);

    // Đếm tất cả sản phẩm của brand (kể cả inactive)
    @Query("SELECT COUNT(p) FROM Product p WHERE p.brand.id = :brandId")
    long countAllProductsByBrandId(@Param("brandId") Long brandId);
}