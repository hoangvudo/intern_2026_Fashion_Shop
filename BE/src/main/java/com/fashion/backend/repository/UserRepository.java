package com.fashion.backend.repository;

import com.fashion.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailToken(String token);

    // 3.5 + 3.6 — tìm user theo reset token
    Optional<User> findByResetToken(String resetToken);
}