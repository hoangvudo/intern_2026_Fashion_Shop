package com.fashion.backend.repository;

import com.fashion.backend.entity.OrderReturn;
import com.fashion.backend.entity.OrderReturnStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderReturnRepository extends JpaRepository<OrderReturn, Long> {

    /** Lấy tất cả yêu cầu theo orderId */
    @Query("SELECT r FROM OrderReturn r LEFT JOIN FETCH r.order o WHERE o.id = :orderId ORDER BY r.createdAt DESC")
    List<OrderReturn> findByOrderIdOrderByCreatedAtDesc(@Param("orderId") Long orderId);

    /** Kiểm tra đơn hàng đã có yêu cầu chưa (tránh duplicate) */
    @Query("SELECT COUNT(r) > 0 FROM OrderReturn r WHERE r.order.id = :orderId AND r.status IN :statuses")
    boolean existsByOrderIdAndStatusIn(
            @Param("orderId") Long orderId,
            @Param("statuses") List<OrderReturnStatus> statuses
    );

    /** Tìm yêu cầu của user hiện tại (qua order.user.id) */
    @Query("SELECT r FROM OrderReturn r " +
            "LEFT JOIN FETCH r.order o " +
            "WHERE o.user.id = :userId " +
            "ORDER BY r.createdAt DESC")
    List<OrderReturn> findByUserId(@Param("userId") Long userId);

    /** Admin: filter theo status + keyword */
    @Query("SELECT r FROM OrderReturn r " +
            "LEFT JOIN FETCH r.order o " +
            "WHERE (:status IS NULL OR r.status = :status) " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "     OR LOWER(r.returnCode) LIKE LOWER(CONCAT('%',:keyword,'%')) " +
            "     OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%',:keyword,'%')) " +
            "     OR LOWER(o.shippingName) LIKE LOWER(CONCAT('%',:keyword,'%'))) " +
            "ORDER BY r.createdAt DESC")
    Page<OrderReturn> findAdminReturns(
            @Param("status") OrderReturnStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    Optional<OrderReturn> findByReturnCode(String returnCode);
}