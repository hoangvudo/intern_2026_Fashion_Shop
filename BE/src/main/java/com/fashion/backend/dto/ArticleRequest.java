package com.fashion.backend.dto;

import lombok.Data;

@Data
public class ArticleRequest {
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String coverImage;
    private String category;
    private String author;
    private String authorAvatar;
    private Integer readMinutes;
    private Boolean isPublished;
    private Boolean isFeatured;
}