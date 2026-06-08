package com.fashion.backend.repository;

import com.fashion.backend.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
    
    Optional<ProductImage> findByIdAndProductId(Long id, Long productId);
    
    List<ProductImage> findByProductIdAndColor(Long productId, String color);
    
    @Query("SELECT img FROM ProductImage img WHERE img.product.id = :productId ORDER BY img.displayOrder ASC")
    List<ProductImage> findByProductIdOrdered(@Param("productId") Long productId);
}
