// BE/src/main/java/com/fashion/backend/dto/BestSellerDto.java
package com.fashion.backend.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BestSellerDto {
    private Long productId;
    private String productName;
    private String category;
    private Long soldQuantity;
    private Integer sellPercent;   // 0-100
}