package com.fashion.backend.controller;

import com.fashion.backend.dto.PasswordResetDto;
import com.fashion.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * 3.4 - POST /api/auth/forgot-password
     * Body: { "email": "user@example.com" }
     * Luôn trả 200 dù email có tồn tại hay không (bảo mật)
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody PasswordResetDto.ForgotPasswordRequest request) {

        passwordResetService.forgotPassword(request);
        return ResponseEntity.ok(Map.of(
                "message", "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu."
        ));
    }

    /**
     * 3.5 - GET /api/auth/reset-password/validate?token=xxx
     * FE gọi khi user click link trong email để kiểm tra token còn hợp lệ không
     * 200 OK       → token hợp lệ
     * 404 Not Found → token không tồn tại
     * 410 Gone     → token đã hết hạn
     */
    @GetMapping("/reset-password/validate")
    public ResponseEntity<Map<String, String>> validateToken(
            @RequestParam String token) {

        passwordResetService.validateToken(token);
        return ResponseEntity.ok(Map.of("message", "Token hợp lệ."));
    }

    /**
     * 3.6 - POST /api/auth/reset-password
     * Body: { "token": "...", "newPassword": "...", "confirmPassword": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody PasswordResetDto.ResetPasswordRequest request) {

        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(Map.of(
                "message", "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."
        ));
    }
}