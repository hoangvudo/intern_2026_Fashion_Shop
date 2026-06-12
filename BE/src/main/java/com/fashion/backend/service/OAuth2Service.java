package com.fashion.backend.service;

import com.fashion.backend.dto.GoogleUserInfo;
import com.fashion.backend.dto.FacebookUserInfo;
import com.fashion.backend.dto.LoginResponse;
import com.fashion.backend.dto.UserDto;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2Service {

    // Google OAuth2
    @Value("${oauth2.google.client-id}")
    private String googleClientId;

    @Value("${oauth2.google.client-secret}")
    private String googleClientSecret;

    @Value("${oauth2.google.redirect-uri}")
    private String googleRedirectUri;

    // Facebook OAuth2
    @Value("${oauth2.facebook.client-id}")
    private String facebookClientId;

    @Value("${oauth2.facebook.client-secret}")
    private String facebookClientSecret;

    @Value("${oauth2.facebook.redirect-uri}")
    private String facebookRedirectUri;

    private static final String GOOGLE_TOKEN_URL =
            "https://oauth2.googleapis.com/token";

    private static final String GOOGLE_USERINFO_URL =
            "https://www.googleapis.com/oauth2/v3/userinfo";

    private static final String FACEBOOK_TOKEN_URL =
            "https://graph.facebook.com/v18.0/oauth/access_token";

    private static final String FACEBOOK_USERINFO_URL =
            "https://graph.facebook.com/me";

    private final UserRepository      userRepository;
    private final JwtUtils            jwtUtils;
    private final RefreshTokenService refreshTokenService;

    private final RestTemplate restTemplate = new RestTemplate();

    // =========================
    // HANDLE GOOGLE CALLBACK
    // =========================
    public LoginResponse handleGoogleCallback(String code) {

        String googleAccessToken = exchangeCodeForGoogleToken(code);
        GoogleUserInfo profile = fetchGoogleUserInfo(googleAccessToken);

        if (!profile.isEmailVerified()) {
            throw new RuntimeException(
                    "Email Google chưa được xác thực"
            );
        }

        User user = upsertGoogleUser(profile);

        String accessToken  = jwtUtils.generateAccessToken(
                user.getEmail(), user.getRole()
        );
        String refreshToken = refreshTokenService.createRefreshToken(user);

        log.info("[OAuth2] Google login thành công: {}", user.getEmail());

        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getPhone(), "NONE", java.math.BigDecimal.ZERO);
        return new LoginResponse(accessToken, refreshToken, userDto);
    }

    // =========================
    // HANDLE FACEBOOK CALLBACK
    // =========================
    public LoginResponse handleFacebookCallback(String code) {

        String facebookAccessToken = exchangeCodeForFacebookToken(code);
        FacebookUserInfo profile = fetchFacebookUserInfo(facebookAccessToken);

        if (profile.getEmail() == null) {
            throw new RuntimeException(
                    "Không lấy được email từ Facebook. Vui lòng cấp quyền email trong cài đặt ứng dụng."
            );
        }

        User user = upsertFacebookUser(profile);

        String accessToken  = jwtUtils.generateAccessToken(
                user.getEmail(), user.getRole()
        );
        String refreshToken = refreshTokenService.createRefreshToken(user);

        log.info("[OAuth2] Facebook login thành công: {}", user.getEmail());

        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getPhone(), "NONE", java.math.BigDecimal.ZERO);
        return new LoginResponse(accessToken, refreshToken, userDto);
    }

    // ========================
    // GOOGLE HELPERS
    // ========================
    private String exchangeCodeForGoogleToken(String code) {

        MultiValueMap<String, String> params =
                new LinkedMultiValueMap<>();

        params.add("code",          code);
        params.add("client_id",     googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("redirect_uri",  googleRedirectUri);
        params.add("grant_type",    "authorization_code");

        // Log chi tiết request parameters
        log.debug("[OAuth2] Google Token Request:");
        log.debug("  - code: {}", code);
        log.debug("  - client_id: {}", googleClientId);
        log.debug("  - client_secret: {}***", googleClientSecret.substring(0, 10));
        log.debug("  - redirect_uri: {}", googleRedirectUri);
        log.debug("  - grant_type: authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> entity =
                new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(GOOGLE_TOKEN_URL, entity, Map.class);

            Map<?, ?> body = response.getBody();
            log.debug("[OAuth2] Google Token Response: status={}, body={}", response.getStatusCode(), body);

            if (body == null || !body.containsKey("access_token")) {
                throw new RuntimeException(
                        "Không lấy được token từ Google"
                );
            }

            return (String) body.get("access_token");

        } catch (Exception e) {
            log.error("[OAuth2] Lỗi đổi code Google: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi xác thực Google: " + e.getMessage());
        }
    }

    private GoogleUserInfo fetchGoogleUserInfo(String googleAccessToken) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(googleAccessToken);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<GoogleUserInfo> response =
                    restTemplate.exchange(
                            GOOGLE_USERINFO_URL,
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
            log.error("[OAuth2] Lỗi lấy profile Google: {}", e.getMessage());
            throw new RuntimeException("Lỗi lấy thông tin Google: " + e.getMessage());
        }
    }

    private User upsertGoogleUser(GoogleUserInfo profile) {

        return userRepository
                .findByEmail(profile.getEmail())
                .orElseGet(() -> {

                    User newUser = new User();
                    newUser.setEmail(profile.getEmail());
                    newUser.setFullName(profile.getName());
                    newUser.setPasswordHash("[oauth2-google]");
                    newUser.setPhone(null);

                    newUser.setIsVerified(true);
                    newUser.setEmailToken(null);
                    newUser.setTokenExpiredAt(null);
                    newUser.setRole("USER");
                    newUser.setCreatedAt(LocalDateTime.now());

                    log.info("[OAuth2] Tạo user mới (Google): {}", profile.getEmail());

                    return userRepository.save(newUser);
                });
    }

    // ========================
    // FACEBOOK HELPERS
    // ========================
    private String exchangeCodeForFacebookToken(String code) {

        MultiValueMap<String, String> params =
                new LinkedMultiValueMap<>();

        params.add("client_id",     facebookClientId);
        params.add("client_secret", facebookClientSecret);
        params.add("redirect_uri",  facebookRedirectUri);
        params.add("code",          code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> entity =
                new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(FACEBOOK_TOKEN_URL, entity, Map.class);

            Map<?, ?> body = response.getBody();

            if (body == null || !body.containsKey("access_token")) {
                throw new RuntimeException(
                        "Không lấy được token từ Facebook"
                );
            }

            return (String) body.get("access_token");

        } catch (Exception e) {
            log.error("[OAuth2] Lỗi đổi code Facebook: {}", e.getMessage());
            throw new RuntimeException("Lỗi xác thực Facebook: " + e.getMessage());
        }
    }

    private FacebookUserInfo fetchFacebookUserInfo(String facebookAccessToken) {

        String url = FACEBOOK_USERINFO_URL + 
                "?fields=id,name,email,picture.width(200).height(200)" +
                "&access_token=" + facebookAccessToken;

        try {
            ResponseEntity<FacebookUserInfo> response =
                    restTemplate.getForEntity(url, FacebookUserInfo.class);

            FacebookUserInfo info = response.getBody();

            if (info == null) {
                throw new RuntimeException("Không lấy được profile từ Facebook");
            }

            log.info("[OAuth2] Facebook profile: id={}, name={}, email={}", 
                    info.getId(), info.getName(), info.getEmail());

            // Nếu không có email (do scope), tạo email fake từ ID
            if (info.getEmail() == null && info.getId() != null) {
                info.setEmail(info.getId() + "@facebook.com");
                log.warn("[OAuth2] Email null, dùng email fake: {}", info.getEmail());
            }

            if (info.getEmail() == null) {
                throw new RuntimeException("Không lấy được email từ Facebook");
            }

            return info;

        } catch (Exception e) {
            log.error("[OAuth2] Lỗi lấy profile Facebook: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi lấy thông tin Facebook: " + e.getMessage());
        }
    }

    private User upsertFacebookUser(FacebookUserInfo profile) {

        return userRepository
                .findByEmail(profile.getEmail())
                .orElseGet(() -> {

                    User newUser = new User();
                    newUser.setEmail(profile.getEmail());
                    newUser.setFullName(profile.getName());
                    newUser.setPasswordHash("[oauth2-facebook]");
                    newUser.setPhone(null);

                    newUser.setIsVerified(true);
                    newUser.setEmailToken(null);
                    newUser.setTokenExpiredAt(null);
                    newUser.setRole("USER");
                    newUser.setCreatedAt(LocalDateTime.now());

                    log.info("[OAuth2] Tạo user mới (Facebook): {}", profile.getEmail());

                    return userRepository.save(newUser);
                });
    }
}