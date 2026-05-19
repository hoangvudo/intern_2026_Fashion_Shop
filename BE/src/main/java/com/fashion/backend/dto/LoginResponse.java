package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    // JWT access token - hết hạn sau 15 phút
    private String accessToken;

    // Refresh token raw - hết hạn sau 7 ngày
    private String refreshToken;

    // User info
    private UserDto user;
}