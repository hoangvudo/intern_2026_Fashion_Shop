package com.fashion.backend.repository;

import com.fashion.backend.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    // Tìm kiếm theo keyword (tên / email / chủ đề) và lọc theo status
    @Query("""
        SELECT c FROM ContactMessage c
        WHERE (:keyword IS NULL OR
               LOWER(c.name)    LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(c.email)   LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(c.subject) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:status IS NULL OR c.status = :status)
        ORDER BY c.createdAt DESC
    """)
    Page<ContactMessage> search(
            @Param("keyword") String keyword,
            @Param("status")  String status,
            Pageable pageable
    );

    // Đếm tin chưa đọc — hiển thị badge trên sidebar
    long countByStatus(String status);
}