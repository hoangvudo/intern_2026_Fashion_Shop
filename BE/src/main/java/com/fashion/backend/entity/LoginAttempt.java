package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Lưu lịch sử đăng nhập thất bại theo IP.
 * - Rate limit : 5 lần sai/phút → 429
 * - CAPTCHA    : bật sau 3 lần sai
 * - Log        : ghi warn mỗi lần thất bại
 */
@Entity
@Table(name = "login_attempts")
@Data
public class LoginAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ipAddress;

    // Số lần thất bại trong window hiện tại
    @Column(nullable = false)
    private int attemptCount = 0;

    // Bắt đầu cửa sổ 1 phút
    @Column(nullable = false)
    private LocalDateTime windowStart;

    // Thời điểm thất bại gần nhất (để log)
    private LocalDateTime lastAttemptAt;

    // Bị block đến thời điểm này
    private LocalDateTime blockedUntil;

    // Bật CAPTCHA sau 3 lần sai
    @Column(nullable = false)
    private boolean captchaRequired = false;
}