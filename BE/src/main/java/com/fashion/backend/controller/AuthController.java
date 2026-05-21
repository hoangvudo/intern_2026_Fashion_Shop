package com.fashion.backend.controller;

import com.fashion.backend.dto.*;
import com.fashion.backend.service.AuthService;
import com.fashion.backend.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

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
        log.info("[Controller] POST /api/auth/verify received with token: {}", token);
        authService.verifyEmail(token);
        log.info("[Controller] Email verified successfully");
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

    // ─── GET CURRENT USER ─────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        // JwtFilter đã set userId vào request
        String userEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        
        com.fashion.backend.entity.User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tìm thấy"));
        
        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
        
        return ResponseEntity.ok(userDto);
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