package com.fashion.backend.repository;

import com.fashion.backend.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    Optional<Article> findBySlug(String slug);

    // Public: chỉ lấy published
    @Query("""
        SELECT a FROM Article a
        WHERE a.isPublished = true
          AND (:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%',:keyword,'%')))
          AND (:category IS NULL OR a.category = :category)
        ORDER BY a.publishedAt DESC
    """)
    Page<Article> findPublished(
            @Param("keyword") String keyword,
            @Param("category") String category,
            Pageable pageable
    );

    // Public: nổi bật
    List<Article> findTop5ByIsPublishedTrueAndIsFeaturedTrueOrderByPublishedAtDesc();

    // Public: mới nhất (sidebar)
    List<Article> findTop4ByIsPublishedTrueOrderByPublishedAtDesc();

    // Admin: tất cả
    @Query("""
        SELECT a FROM Article a
        WHERE (:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%',:keyword,'%')))
          AND (:category IS NULL OR a.category = :category)
          AND (:isPublished IS NULL OR a.isPublished = :isPublished)
        ORDER BY a.createdAt DESC
    """)
    Page<Article> adminSearch(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("isPublished") Boolean isPublished,
            Pageable pageable
    );

    // Tăng view count
    @Modifying
    @Query("UPDATE Article a SET a.viewCount = a.viewCount + 1 WHERE a.id = :id")
    void incrementViewCount(@Param("id") Long id);
}