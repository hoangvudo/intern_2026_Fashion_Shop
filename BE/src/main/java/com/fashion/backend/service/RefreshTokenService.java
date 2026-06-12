package com.fashion.backend.service;

import com.fashion.backend.entity.RefreshToken;
import com.fashion.backend.entity.User;
import com.fashion.backend.repository.RefreshTokenRepository;
import com.fashion.backend.utils.JwtUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * Task 1.6 — Quản lý refresh token 7 ngày.
 *
 * Lưu ý bảo mật:
 *  - Chỉ lưu HASH của token vào DB (không lưu raw).
 *  - Áp dụng Refresh Token Rotation: mỗi lần refresh
 *    → thu hồi token cũ, phát token mới.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtils jwtUtils;

    // =========================
    // TẠO VÀ LƯU REFRESH TOKEN
    // =========================
    @Transactional
    public String createRefreshToken(User user) {

        // Sinh raw token
        String rawToken = jwtUtils.generateRefreshToken();

        // Hash trước khi lưu DB
        String hash = sha256(rawToken);

        RefreshToken entity = new RefreshToken();
        entity.setUser(user);
        entity.setTokenHash(hash);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setExpiresAt(
                LocalDateTime.now()
                        .plusDays(JwtUtils.REFRESH_TOKEN_DAYS)
        );
        entity.setRevoked(false);

        refreshTokenRepository.save(entity);

        // Trả raw token về client
        return rawToken;
    }

    // =========================
    // XÁC THỰC VÀ ROTATE TOKEN
    // Trả về User nếu hợp lệ, ném exception nếu không
    // =========================
    @Transactional
    public User validateAndRotate(String rawToken) {

        String hash = sha256(rawToken);

        RefreshToken stored = refreshTokenRepository
                .findByTokenHashAndRevokedFalse(hash)
                .orElseThrow(() ->
                        new RuntimeException("Refresh token không hợp lệ")
                );

        // Kiểm tra hết hạn
        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            stored.setRevoked(true);
            refreshTokenRepository.save(stored);
            throw new RuntimeException("Refresh token đã hết hạn");
        }

        // Thu hồi token cũ (rotation)
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        return stored.getUser();
    }

    // =========================
    // THU HỒI 1 TOKEN CỤ THỂ (logout)
    // =========================
    @Transactional
    public void revokeByRawToken(String rawToken) {
        String hash = sha256(rawToken);
        refreshTokenRepository
                .findByTokenHashAndRevokedFalse(hash)
                .ifPresent(t -> {
                    t.setRevoked(true);
                    refreshTokenRepository.save(t);
                });
        // Nếu token không tồn tại hoặc đã revoked → vẫn OK
    }

    // =========================
    // THU HỒI TẤT CẢ TOKEN (logout all devices)
    // =========================
    @Transactional
    public void revokeAll(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }

    // =========================
    // SHA-256 HASH
    // =========================
    private String sha256(String input) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");
            byte[] hash =
                    digest.digest(
                            input.getBytes(StandardCharsets.UTF_8)
                    );
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Hash error", e);
        }
    }
}