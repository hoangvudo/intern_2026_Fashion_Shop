package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
<<<<<<< Updated upstream
import lombok.Data;
import lombok.NoArgsConstructor;
=======
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
>>>>>>> Stashed changes

@Data
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< Updated upstream
public class    UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String role;
=======
@Builder
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private BigDecimal totalSpent;
    private String vipTier;
>>>>>>> Stashed changes
}
