package com.fashion.backend.service;

import com.fashion.backend.dto.PasswordResetDto;
import com.fashion.backend.entity.User;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.exception.TokenExpiredException;
import com.fashion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository  userRepository;
    private final EmailService    emailService;
    private final PasswordEncoder passwordEncoder;

    private static final int TOKEN_EXPIRE_HOURS = 1;

    // ── 3.4 Gửi email reset mật khẩu ─────────────────────────────────────────

    @Transactional
    public void forgotPassword(PasswordResetDto.ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            if (!Boolean.TRUE.equals(user.getIsActive())) {
                log.warn("[PasswordReset] User bị khoá cố reset: {}", user.getEmail());
                return;
            }

            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExp(LocalDateTime.now().plusHours(TOKEN_EXPIRE_HOURS));
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), token);
            log.info("[PasswordReset] Đã gửi email reset cho: {}", user.getEmail());
        });
    }

    // ── 3.5 Xác thực token ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public void validateToken(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new NotFoundException("Token không tồn tại."));

        if (user.getResetTokenExp() == null ||
                user.getResetTokenExp().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token đã hết hạn.");
        }
    }

    // ── 3.6 Đặt lại mật khẩu ─────────────────────────────────────────────────

    @Transactional
    public void resetPassword(PasswordResetDto.ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp.");
        }

        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new NotFoundException("Token không tồn tại."));

        if (user.getResetTokenExp() == null ||
                user.getResetTokenExp().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token đã hết hạn.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExp(null);
        userRepository.save(user);

        emailService.sendPasswordChangedEmail(user.getEmail(), user.getFullName());
        log.info("[PasswordReset] Đổi mật khẩu thành công cho: {}", user.getEmail());
    }
}