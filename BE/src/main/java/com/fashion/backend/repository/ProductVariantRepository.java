package com.fashion.backend.repository;

import com.fashion.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
    Long countByStockLessThan(int threshold);

    @Query("SELECT COALESCE(SUM(v.stock * p.price), 0) FROM ProductVariant v JOIN v.product p")
    BigDecimal calculateInventoryValue();
}