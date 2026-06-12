package com.fashion.backend.controller;

import com.fashion.backend.dto.*;
import com.fashion.backend.service.AuthService;
import com.fashion.backend.repository.UserRepository;
<<<<<<< Updated upstream
=======
import com.fashion.backend.repository.OrderRepository;
>>>>>>> Stashed changes

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

<<<<<<< Updated upstream
=======
import java.math.BigDecimal;

>>>>>>> Stashed changes
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
<<<<<<< Updated upstream
=======
    private final OrderRepository orderRepository;
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        // JwtFilter đã set userId vào request
=======
>>>>>>> Stashed changes
        String userEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        
        com.fashion.backend.entity.User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tìm thấy"));
<<<<<<< Updated upstream
        
        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
=======

        // Tính tổng chi tiêu từ các đơn COMPLETED
        BigDecimal totalSpent = orderRepository.sumTotalSpentByUserId(user.getId());
        if (totalSpent == null) totalSpent = BigDecimal.ZERO;

        String vipTier = calculateVipTier(totalSpent);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .totalSpent(totalSpent)
                .vipTier(vipTier)
                .build();
>>>>>>> Stashed changes
        
        return ResponseEntity.ok(userDto);
    }

<<<<<<< Updated upstream
=======
    // ─── UPDATE PROFILE ───────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody java.util.Map<String, String> body) {
        String userEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        com.fashion.backend.entity.User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User không tìm thấy"));

        String fullName = body.get("fullName");
        String phone    = body.get("phone");

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }
        if (phone != null) {
            user.setPhone(phone.isBlank() ? null : phone.trim());
        }

        userRepository.save(user);

        BigDecimal totalSpent = orderRepository.sumTotalSpentByUserId(user.getId());
        if (totalSpent == null) totalSpent = BigDecimal.ZERO;

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .totalSpent(totalSpent)
                .vipTier(calculateVipTier(totalSpent))
                .build();

        return ResponseEntity.ok(userDto);
    }

    // ─── VIP TIER HELPER ──────────────────────────────────────
    private String calculateVipTier(BigDecimal totalSpent) {
        if (totalSpent.compareTo(new BigDecimal("50000000")) >= 0) return "DIAMOND";
        if (totalSpent.compareTo(new BigDecimal("30000000")) >= 0) return "PLATINUM";
        if (totalSpent.compareTo(new BigDecimal("15000000")) >= 0) return "GOLD";
        if (totalSpent.compareTo(new BigDecimal("5000000"))  >= 0) return "SILVER";
        return "NONE";
    }

>>>>>>> Stashed changes
    // ─── HELPER: lấy real IP kể cả sau proxy/nginx ────────────
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isBlank()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}