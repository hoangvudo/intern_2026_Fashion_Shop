package com.fashion.backend.service;

import com.fashion.backend.entity.LoginAttempt;
import com.fashion.backend.repository.LoginAttemptRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Task 1.8 — Rate limiting đăng nhập theo IP.
 *
 * Quy tắc:
 *  - Cửa sổ thời gian: 1 phút
 *  - Tối đa 5 lần thất bại → trả 429
 *  - Block 15 phút sau khi vượt ngưỡng
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimitService {

    private static final int MAX_ATTEMPTS   = 5;
    private static final int WINDOW_MINUTES = 1;
    private static final int BLOCK_MINUTES  = 15;

    private final LoginAttemptRepository loginAttemptRepository;

    // =========================
    // KIỂM TRA IP CÓ BỊ BLOCK KHÔNG
    // =========================
    public void checkRateLimit(String ip) {

        loginAttemptRepository
                .findByIpAddress(ip)
                .ifPresent(attempt -> {

                    // Nếu đang bị block
                    if (attempt.getBlockedUntil() != null &&
                            attempt.getBlockedUntil().isAfter(LocalDateTime.now())) {

                        long remaining = java.time.Duration
                                .between(LocalDateTime.now(), attempt.getBlockedUntil())
                                .toMinutes();

                        throw new TooManyRequestsException(
                                "Quá nhiều lần thử. Vui lòng chờ "
                                        + remaining + " phút."
                        );
                    }

                    // Nếu đã hết block, reset
                    if (attempt.getBlockedUntil() != null &&
                            !attempt.getBlockedUntil().isAfter(LocalDateTime.now())) {
                        attempt.setAttemptCount(0);
                        attempt.setBlockedUntil(null);
                        attempt.setWindowStart(LocalDateTime.now());
                        loginAttemptRepository.save(attempt);
                    }
                });
    }

    // =========================
    // GHI NHẬN LOGIN THẤT BẠI
    // =========================
    public void recordFailure(String ip) {

        LocalDateTime now = LocalDateTime.now();

        LoginAttempt attempt = loginAttemptRepository
                .findByIpAddress(ip)
                .orElseGet(() -> {
                    LoginAttempt a = new LoginAttempt();
                    a.setIpAddress(ip);
                    a.setWindowStart(now);
                    a.setAttemptCount(0);
                    return a;
                });

        // Reset window nếu đã qua 1 phút
        if (attempt.getWindowStart()
                .isBefore(now.minusMinutes(WINDOW_MINUTES))) {
            attempt.setAttemptCount(0);
            attempt.setWindowStart(now);
        }

        attempt.setAttemptCount(attempt.getAttemptCount() + 1);

        // Vượt ngưỡng → block
        if (attempt.getAttemptCount() >= MAX_ATTEMPTS) {

            attempt.setBlockedUntil(now.plusMinutes(BLOCK_MINUTES));

            log.warn("[SECURITY] IP {} bị block sau {} lần thất bại", ip, MAX_ATTEMPTS);
        }

        loginAttemptRepository.save(attempt);
    }

    // =========================
    // RESET SAU LOGIN THÀNH CÔNG
    // =========================
    public void resetAttempts(String ip) {

        loginAttemptRepository
                .findByIpAddress(ip)
                .ifPresent(attempt -> {
                    attempt.setAttemptCount(0);
                    attempt.setBlockedUntil(null);
                    loginAttemptRepository.save(attempt);
                });
    }

    // =========================
    // INNER EXCEPTION (HTTP 429)
    // =========================
    public static class TooManyRequestsException
            extends RuntimeException {

        public TooManyRequestsException(String message) {
            super(message);
        }
    }
}