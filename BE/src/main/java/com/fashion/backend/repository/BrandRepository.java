package com.fashion.backend.repository;

import com.fashion.backend.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findBySlug(String slug);
    List<Brand> findByIsActiveTrue();
    boolean existsBySlug(String slug);
}
