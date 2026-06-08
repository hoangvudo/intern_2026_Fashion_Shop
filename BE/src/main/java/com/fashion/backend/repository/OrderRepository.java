package com.fashion.backend.repository;

import com.fashion.backend.entity.Order;
import com.fashion.backend.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);

    @Query(value = """
        SELECT oi.product_id,
               p.name,
               SUM(oi.quantity) as total_sold,
               c.name as category_name
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        LEFT JOIN categories c ON c.id = p.category_id
        JOIN orders o ON o.id = oi.order_id
        WHERE o.status = 'COMPLETED'
        GROUP BY oi.product_id, p.name, c.name
        ORDER BY total_sold DESC
        """, nativeQuery = true)
    List<Object[]> findBestSellers(Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
            "WHERE o.status = 'COMPLETED' AND o.createdAt BETWEEN :start AND :end")
    BigDecimal sumRevenueByDateRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.createdAt) = CURRENT_DATE")
    Long countTodayOrders();

    Long countByStatus(OrderStatus status);

    @Query(value = """
        SELECT DATE(o.created_at) as date,
               SUM(o.total_amount) as revenue,
               SUM(o.total_amount * 0.3) as profit
        FROM orders o
        WHERE o.status = 'COMPLETED'
          AND o.created_at >= :since
        GROUP BY DATE(o.created_at)
        ORDER BY date ASC
        """, nativeQuery = true)
    List<Object[]> findDailyRevenue(@Param("since") LocalDateTime since);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findTop10ByOrderByCreatedAtDesc(Pageable pageable);

    // Admin order management
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product " +
            "WHERE (:status IS NULL OR o.status = :status) " +
            "AND (:keyword IS NULL OR :keyword = '' OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%',:keyword,'%')) " +
            "     OR LOWER(o.shippingName) LIKE LOWER(CONCAT('%',:keyword,'%')) " +
            "     OR LOWER(o.shippingPhone) LIKE LOWER(CONCAT('%',:keyword,'%'))) " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findAdminOrders(
            @Param("status") OrderStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.user.id = :userId AND o.status = 'COMPLETED'")
    BigDecimal sumTotalSpentByUserId(@Param("userId") Long userId);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product " +
            "WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}