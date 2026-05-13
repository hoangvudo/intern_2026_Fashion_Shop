package com.fashion.backend.controller;

import com.fashion.backend.dto.*;
import com.fashion.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ─── REGISTER ────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.register(request);
        return ResponseEntity.ok("Đăng ký thành công. Vui lòng kiểm tra email.");
    }

    // ─── CHECK EMAIL ──────────────────────────────────────────
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(
            @RequestParam String email
    ) {
        boolean exists = authService.checkEmail(email);
        return ResponseEntity.ok(new CheckEmailResponse(exists));
    }

    // ─── VERIFY EMAIL ─────────────────────────────────────────
    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token
    ) {
        authService.verifyEmail(token);
        return ResponseEntity.ok("Xác thực email thành công");
    }

    // ─── LOGIN — Task 1.5 + 1.6 + 1.8 ───────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        String ip = getClientIp(httpRequest);
        LoginResponse response = authService.login(request, ip);
        return ResponseEntity.ok(response);
    }

    // ─── REFRESH TOKEN — Task 1.6 ─────────────────────────────
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @Valid @RequestBody TokenRefreshRequest request
    ) {
        TokenRefreshResponse response =
                authService.refresh(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    // ─── LOGOUT ───────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestBody TokenRefreshRequest request
    ) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok("Đăng xuất thành công");
    }

    // ─── HELPER: lấy real IP kể cả sau proxy/nginx ────────────
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isBlank()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}