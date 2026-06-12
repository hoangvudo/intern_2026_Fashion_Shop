package com.fashion.backend.service;

import com.fashion.backend.dto.LoginRequest;
import com.fashion.backend.dto.LoginResponse;
import com.fashion.backend.dto.RegisterRequest;
import com.fashion.backend.dto.TokenRefreshResponse;
import com.fashion.backend.dto.UserDto;
import com.fashion.backend.entity.User;
import com.fashion.backend.repository.UserRepository;
import com.fashion.backend.utils.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository      userRepository;
    private final PasswordEncoder     passwordEncoder;
    private final EmailService        emailService;
    private final JwtUtils            jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final RateLimitService    rateLimitService;

    // =========================
    // CHECK EMAIL
    // =========================
    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // =========================
    // REGISTER
    // =========================
    public void register(RegisterRequest request) {

        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email existed");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone existed");
        }

        String hash  = passwordEncoder.encode(request.getPassword());
        String token = UUID.randomUUID().toString();

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(hash);
        user.setEmailToken(token);
        user.setTokenExpiredAt(LocalDateTime.now().plusHours(24));
        user.setIsVerified(false);
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        log.info("[Auth] User registered - email: {}, token: {}, tokenExpiredAt: {}",
                user.getEmail(), user.getEmailToken(), user.getTokenExpiredAt());

        emailService.sendVerifyEmail(user);
    }

    // =========================
    // VERIFY EMAIL
    // =========================
    public void verifyEmail(String token) {

        log.info("[Auth] Attempting to verify email with token: {}", token);

        User user = userRepository
                .findByEmailToken(token)
                .orElseThrow(() -> {
                    log.error("[Auth] Token not found in DB: {}", token);
                    return new RuntimeException("Token không hợp lệ");
                });

        log.info("[Auth] User found: {}, tokenExpiredAt: {}", user.getEmail(), user.getTokenExpiredAt());

        if (user.getTokenExpiredAt() == null) {
            log.error("[Auth] Token expired at is null for user: {}", user.getEmail());
            throw new RuntimeException("Token không hợp lệ");
        }

        if (user.getTokenExpiredAt()
                .isBefore(LocalDateTime.now())) {
            log.error("[Auth] Token expired for user: {}", user.getEmail());
            throw new RuntimeException("Token đã hết hạn");
        }

        user.setIsVerified(true);
        user.setEmailToken(null);
        user.setTokenExpiredAt(null);
        userRepository.save(user);

        log.info("[Auth] Email verified successfully for user: {}", user.getEmail());
    }

    // =========================
    // LOGIN — Task 1.5 + 1.6 + 1.8
    // =========================
    public LoginResponse login(LoginRequest request, String clientIp) {

        // 1.8 — Kiểm tra rate limit trước
        rateLimitService.checkRateLimit(clientIp);

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    rateLimitService.recordFailure(clientIp);
                    return new RuntimeException("Email không tồn tại");
                });

        // Kiểm tra xác thực email
        if (!user.getIsVerified()) {
            rateLimitService.recordFailure(clientIp);
            throw new RuntimeException("Email chưa xác thực");
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {
            rateLimitService.recordFailure(clientIp);
            throw new RuntimeException("Sai mật khẩu");
        }

        // Login thành công → reset attempt counter
        rateLimitService.resetAttempts(clientIp);

        // 1.6 — Tạo access token (15 phút) + refresh token (7 ngày)
        String accessToken  = jwtUtils.generateAccessToken(user.getEmail(), user.getRole());
        String refreshToken = refreshTokenService.createRefreshToken(user);

        UserDto userDto = UserDto.builder().id(user.getId()).email(user.getEmail()).fullName(user.getFullName()).role(user.getRole()).build();
        return new LoginResponse(accessToken, refreshToken, userDto);
    }

    // =========================
    // REFRESH TOKEN — Task 1.6
    // =========================
    public TokenRefreshResponse refresh(String rawRefreshToken) {

        // Xác thực + rotate token cũ
        User user = refreshTokenService.validateAndRotate(rawRefreshToken);

        // Phát token mới
        String newAccessToken  = jwtUtils.generateAccessToken(user.getEmail(), user.getRole());
        String newRefreshToken = refreshTokenService.createRefreshToken(user);

        UserDto userDto = UserDto.builder().id(user.getId()).email(user.getEmail()).fullName(user.getFullName()).role(user.getRole()).build();
        return new TokenRefreshResponse(newAccessToken, newRefreshToken, userDto);
    }

    // =========================
    // LOGOUT — Thu hồi refresh token
    // =========================
    public void logout(String rawRefreshToken) {
        refreshTokenService.revokeByRawToken(rawRefreshToken);
    }
}