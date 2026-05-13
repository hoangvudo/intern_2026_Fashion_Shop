package com.fashion.backend.service;

import com.fashion.backend.dto.GoogleUserInfo;
import com.fashion.backend.dto.LoginResponse;
import com.fashion.backend.entity.User;
import com.fashion.backend.repository.UserRepository;
import com.fashion.backend.utils.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Task 1.7 — OAuth2 Google callback.
 *
 * Flow:
 *  1. Client gọi GET /api/auth/oauth2/google?code=...
 *  2. Server đổi code → access_token Google
 *  3. Dùng access_token lấy profile (email, name)
 *  4. Upsert user vào DB
 *  5. Phát JWT access + refresh token như login thường
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2Service {

    // Cấu hình trong application.yml
    @Value("${oauth2.google.client-id}")
    private String clientId;

    @Value("${oauth2.google.client-secret}")
    private String clientSecret;

    @Value("${oauth2.google.redirect-uri}")
    private String redirectUri;

    private static final String TOKEN_URL =
            "https://oauth2.googleapis.com/token";

    private static final String USERINFO_URL =
            "https://www.googleapis.com/oauth2/v3/userinfo";

    private final UserRepository      userRepository;
    private final JwtUtils            jwtUtils;
    private final RefreshTokenService refreshTokenService;

    private final RestTemplate restTemplate = new RestTemplate();

    // =========================
    // HANDLE GOOGLE CALLBACK
    // =========================
    public LoginResponse handleGoogleCallback(String code) {

        // Bước 1: Đổi authorization code → Google access token
        String googleAccessToken = exchangeCodeForToken(code);

        // Bước 2: Lấy thông tin user từ Google
        GoogleUserInfo profile = fetchUserInfo(googleAccessToken);

        if (!profile.isEmailVerified()) {
            throw new RuntimeException(
                    "Email Google chưa được xác thực"
            );
        }

        // Bước 3: Upsert user (tìm hoặc tạo mới)
        User user = upsertUser(profile);

        // Bước 4: Phát JWT giống như login thường
        String accessToken  = jwtUtils.generateAccessToken(
                user.getEmail(), user.getRole()
        );
        String refreshToken = refreshTokenService.createRefreshToken(user);

        log.info("[OAuth2] Login thành công: {}", user.getEmail());

        return new LoginResponse(accessToken, refreshToken);
    }

    // =========================
    // ĐỔI CODE → GOOGLE ACCESS TOKEN
    // =========================
    private String exchangeCodeForToken(String code) {

        MultiValueMap<String, String> params =
                new LinkedMultiValueMap<>();

        params.add("code",          code);
        params.add("client_id",     clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri",  redirectUri);
        params.add("grant_type",    "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> entity =
                new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(TOKEN_URL, entity, Map.class);

            Map<?, ?> body = response.getBody();

            if (body == null || !body.containsKey("access_token")) {
                throw new RuntimeException(
                        "Không lấy được token từ Google"
                );
            }

            return (String) body.get("access_token");

        } catch (Exception e) {
            log.error("[OAuth2] Lỗi đổi code: {}", e.getMessage());
            throw new RuntimeException("Lỗi xác thực Google: " + e.getMessage());
        }
    }

    // =========================
    // LẤY PROFILE TỪ GOOGLE
    // =========================
    private GoogleUserInfo fetchUserInfo(String googleAccessToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(googleAccessToken);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<GoogleUserInfo> response =
                    restTemplate.exchange(
                            USERINFO_URL,
                            HttpMethod.GET,
                            entity,
                            GoogleUserInfo.class
                    );

            GoogleUserInfo info = response.getBody();

            if (info == null || info.getEmail() == null) {
                throw new RuntimeException("Không lấy được profile từ Google");
            }

            return info;

        } catch (Exception e) {
            log.error("[OAuth2] Lỗi lấy profile: {}", e.getMessage());
            throw new RuntimeException("Lỗi lấy thông tin Google: " + e.getMessage());
        }
    }

    // =========================
    // UPSERT USER
    // Tìm theo email → nếu chưa có thì tạo mới
    // =========================
    private User upsertUser(GoogleUserInfo profile) {

        return userRepository
                .findByEmail(profile.getEmail())
                .orElseGet(() -> {

                    User newUser = new User();
                    newUser.setEmail(profile.getEmail());
                    newUser.setFullName(profile.getName());

                    // OAuth2 user không cần password / phone
                    // Đặt password random để không đăng nhập bằng form được
                    newUser.setPassword("[oauth2-google]");
                    newUser.setPhone(null);

                    newUser.setIsVerified(true);   // Google đã xác thực email
                    newUser.setEmailToken(null);
                    newUser.setTokenExpiredAt(null);
                    newUser.setRole("USER");
                    newUser.setCreatedAt(LocalDateTime.now());

                    log.info("[OAuth2] Tạo user mới: {}", profile.getEmail());

                    return userRepository.save(newUser);
                });
    }
}