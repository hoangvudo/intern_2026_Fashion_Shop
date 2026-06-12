package com.fashion.backend.dto;

import com.fashion.backend.entity.Review;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewResponse {

    private Long id;
    private Long productId;
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