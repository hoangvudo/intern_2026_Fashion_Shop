package com.fashion.backend.service;

import com.fashion.backend.dto.LoginRequest;
import com.fashion.backend.dto.RegisterRequest;
import com.fashion.backend.entity.User;
import com.fashion.backend.repository.UserRepository;
import com.fashion.backend.utils.JwtUtils;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    private final JwtUtils jwtUtils;

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

        // check confirm password
        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "Password not match"
            );
        }

        // check email existed
        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email existed"
            );
        }

        // check phone existed
        if (userRepository.existsByPhone(request.getPhone())) {

            throw new RuntimeException(
                    "Phone existed"
            );
        }

        // hash password
        String hash =
                passwordEncoder.encode(
                        request.getPassword()
                );

        // generate verify token
        String token =
                UUID.randomUUID().toString();

        User user = new User();

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setPhone(
                request.getPhone()
        );

        user.setPassword(hash);

        // verify email token
        user.setEmailToken(token);

        user.setTokenExpiredAt(
                LocalDateTime.now().plusHours(24)
        );

        // verify status
        user.setIsVerified(false);

        // default role
        user.setRole("USER");

        // created time
        user.setCreatedAt(
                LocalDateTime.now()
        );

        // save db
        userRepository.save(user);

        // send mail
        emailService.sendVerifyEmail(user);
    }

    // =========================
    // VERIFY EMAIL
    // =========================
    public void verifyEmail(String token) {

        User user = userRepository
                .findByEmailToken(token)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Token không hợp lệ"
                        ));

        // check expired
        if (user.getTokenExpiredAt()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Token đã hết hạn"
            );
        }

        // update verify
        user.setIsVerified(true);

        user.setEmailToken(null);

        user.setTokenExpiredAt(null);

        userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public String login(
            LoginRequest request
    ) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Email không tồn tại"
                        ));

        // check verify
        if (!user.getIsVerified()) {

            throw new RuntimeException(
                    "Email chưa xác thực"
            );
        }

        // check password
        boolean match =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!match) {

            throw new RuntimeException(
                    "Sai mật khẩu"
            );
        }

        // generate jwt token
        return jwtUtils.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }
}