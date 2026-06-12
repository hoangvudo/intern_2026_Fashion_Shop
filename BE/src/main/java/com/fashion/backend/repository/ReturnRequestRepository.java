package com.fashion.backend.repository;
import com.fashion.backend.entity.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    List<ReturnRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<ReturnRequest> findByOrderIdAndUserId(Long orderId, Long userId);

    boolean existsByOrderIdAndUserId(Long orderId, Long userId);
}
 