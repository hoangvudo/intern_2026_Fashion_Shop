package com.fashion.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtils {

    // Refresh token expiry: 7 ngày (dùng khi lưu DB)
    public static final long REFRESH_TOKEN_DAYS = 7;

    // Đọc từ application.yml
    @Value("${jwt.secret}")
    private String jwtSecretString;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecretString.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

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
                        new Date(System.currentTimeMillis() + accessTokenExpiration)
                )
                .signWith(getSigningKey())
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
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // =========================
    // VALIDATE ACCESS TOKEN
    // =========================
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}