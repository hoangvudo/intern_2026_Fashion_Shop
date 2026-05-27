package com.fashion.backend.repository;

import com.fashion.backend.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface LoginAttemptRepository
        extends JpaRepository<LoginAttempt, Long> {

    Optional<LoginAttempt> findByIpAddress(String ipAddress);

    // Xóa record cũ hơn 1 giờ để tránh bảng phình to
    @Modifying
    @Transactional
    @Query("DELETE FROM LoginAttempt a WHERE a.windowStart < :cutoff")
    void deleteOldAttempts(LocalDateTime cutoff);
}