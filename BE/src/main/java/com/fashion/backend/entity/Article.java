package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Data
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String excerpt; // mô tả ngắn

    @Column(columnDefinition = "LONGTEXT")
    private String content; // nội dung HTML đầy đủ

    @Column(length = 2000)
    private String coverImage;

    private String category; // STYLE | TREND | CULTURE | BEAUTY | LIFE

    private String author;

    private String authorAvatar;

    private Integer readMinutes = 5;

    private Boolean isPublished = false;

    private Boolean isFeatured = false;

    private Integer viewCount = 0;

    private LocalDateTime publishedAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}