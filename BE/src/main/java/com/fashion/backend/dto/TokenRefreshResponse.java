package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenRefreshResponse {

    // Access token mới (15 phút)
    private String accessToken;

    // Refresh token mới (rotation - 7 ngày)
    private String refreshToken;
}