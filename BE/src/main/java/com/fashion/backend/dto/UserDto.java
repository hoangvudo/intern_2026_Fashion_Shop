package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class    UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String phone;
    private String vipTier;
    private java.math.BigDecimal totalSpent;
}
