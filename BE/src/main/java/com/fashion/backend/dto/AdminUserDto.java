package com.fashion.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private Boolean isActive;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private Long totalOrders;
    private java.math.BigDecimal totalSpent;
    private String vipTier;
}