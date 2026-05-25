package com.fashion.backend.config;

import com.fashion.backend.entity.User;
import com.fashion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.enabled:true}")
    private boolean enabled;

    @Value("${app.admin.email:admin@zyro.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.admin.full-name:ZYRO Admin}")
    private String adminFullName;

    @Value("${app.admin.phone:0900000001}")
    private String adminPhone;

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) {
            return;
        }

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                existing -> ensureAdminRole(existing),
                this::createAdminUser
        );
    }

    private void createAdminUser() {
        if (userRepository.existsByPhone(adminPhone)) {
            log.warn(
                    "[AdminSeed] Phone {} already used — skip creating admin. Change app.admin.phone in application.yml",
                    adminPhone
            );
            return;
        }

        User admin = new User();
        admin.setFullName(adminFullName);
        admin.setEmail(adminEmail);
        admin.setPhone(adminPhone);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setIsVerified(true);
        admin.setIsActive(true);
        admin.setRole("ADMIN");
        admin.setCreatedAt(LocalDateTime.now());

        userRepository.save(admin);

        log.info("========================================");
        log.info("[AdminSeed] Admin account created");
        log.info("  Email   : {}", adminEmail);
        log.info("  Password: {}", adminPassword);
        log.info("  Login   : http://localhost:3000/login");
        log.info("  Admin   : http://localhost:3000/admin");
        log.info("========================================");
    }

    private void ensureAdminRole(User user) {
        if ("ADMIN".equals(user.getRole())) {
            if (!Boolean.TRUE.equals(user.getIsVerified())) {
                user.setIsVerified(true);
                userRepository.save(user);
                log.info("[AdminSeed] Admin {} marked as verified", adminEmail);
            }
            return;
        }

        user.setRole("ADMIN");
        user.setIsVerified(true);
        userRepository.save(user);
        log.info("[AdminSeed] Existing user {} upgraded to ADMIN", adminEmail);
    }
}
