package com.fashion.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fashion.backend.entity.Article;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArticleResponse {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String coverImage;
    private String category;
    private String author;
    private String authorAvatar;
    private Integer readMinutes;
    private Integer viewCount;

    @JsonProperty("isPublished")
    private Boolean isPublished;

    @JsonProperty("isFeatured")
    private Boolean isFeatured;

    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ArticleResponse from(Article a) {
        ArticleResponse r = new ArticleResponse();
        r.setId(a.getId());
        r.setTitle(a.getTitle());
        r.setSlug(a.getSlug());
        r.setExcerpt(a.getExcerpt());
        r.setContent(a.getContent());
        r.setCoverImage(a.getCoverImage());
        r.setCategory(a.getCategory());
        r.setAuthor(a.getAuthor());
        r.setAuthorAvatar(a.getAuthorAvatar());
        r.setReadMinutes(a.getReadMinutes());
        r.setViewCount(a.getViewCount());
        r.setIsPublished(a.getIsPublished());
        r.setIsFeatured(a.getIsFeatured());
        r.setPublishedAt(a.getPublishedAt());
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        return r;
    }
}