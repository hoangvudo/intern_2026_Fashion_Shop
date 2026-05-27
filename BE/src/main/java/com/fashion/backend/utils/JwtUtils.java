package com.fashion.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtils {

    // =========================
    // SECRET KEY (nên đưa vào application.yml)
    // =========================
    private final String jwtSecret =
            "abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

    // Access token: 15 phút
    private final long ACCESS_TOKEN_MS = 15 * 60 * 1000L;

    // Refresh token expiry: 7 ngày (dùng khi lưu DB)
    public static final long REFRESH_TOKEN_DAYS = 7;

    // =========================
    // GENERATE ACCESS TOKEN (15 phút)
    // =========================
    public String generateAccessToken(
            String email,
            String role
    ) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("type", "access")
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + ACCESS_TOKEN_MS)
                )
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    // =========================
    // GENERATE REFRESH TOKEN (opaque random string)
    // Token này KHÔNG phải JWT — chỉ là random bytes.
    // Hash SHA-256 trước khi lưu DB, trả raw về client.
    // =========================
    public String generateRefreshToken() {
        byte[] bytes = new byte[64];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    // =========================
    // GET EMAIL FROM TOKEN
    // =========================
    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    // =========================
    // GET ROLE FROM TOKEN
    // =========================
    public String getRoleFromToken(String token) {
        return getClaims(token).get("role", String.class);
    }

    // =========================
    // GET CLAIMS
    // =========================
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
    }

    // =========================
    // VALIDATE ACCESS TOKEN
    // =========================
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}