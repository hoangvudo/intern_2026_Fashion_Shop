package com.fashion.backend.dto;

import com.fashion.backend.entity.Review;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productMainImage;
    private Long userId;
    private String userFullName;
    private Long orderId;
    private Integer rating;
    private String comment;
    private List<String> imageUrls;
    private Boolean isVisible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReviewResponse from(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setProductId(r.getProduct().getId());
        res.setProductName(r.getProduct().getName());

        // Ưu tiên thumbnailUrl, nếu null thì lấy ảnh đầu tiên trong product_images
        String thumb = r.getProduct().getThumbnailUrl();
        if (thumb == null || thumb.isBlank()) {
            if (r.getProduct().getImages() != null && !r.getProduct().getImages().isEmpty()) {
                thumb = r.getProduct().getImages().stream()
                        .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                        .map(img -> img.getImageUrl())
                        .findFirst()
                        .orElse(r.getProduct().getImages().get(0).getImageUrl());
            }
        }
        res.setProductMainImage(thumb);

        res.setUserId(r.getUser().getId());
        res.setUserFullName(r.getUser().getFullName());
        res.setOrderId(r.getOrderId());
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setImageUrls(r.getImageUrls());
        res.setIsVisible(r.getIsVisible());
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());
        return res;
    }
}