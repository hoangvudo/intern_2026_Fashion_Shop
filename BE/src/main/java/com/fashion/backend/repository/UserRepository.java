package com.fashion.backend.repository;

import com.fashion.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByEmailToken(String token);

    Optional<User> findByResetToken(String resetToken);

    Long countByCreatedAtAfter(LocalDateTime date);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%',:kw,'%'))")
    Page<User> findByKeyword(@Param("kw") String keyword, Pageable pageable);
}
