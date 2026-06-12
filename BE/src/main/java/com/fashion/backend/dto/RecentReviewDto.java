package com.fashion.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentReviewDto {
    private String customerName;
    private String content;
    private String timeAgo;
    private Double rating;
}