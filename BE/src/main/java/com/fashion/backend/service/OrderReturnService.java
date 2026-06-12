package com.fashion.backend.service;

import com.fashion.backend.dto.OrderReturnRequest;
import com.fashion.backend.dto.OrderReturnResponse;
import com.fashion.backend.entity.*;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.OrderRepository;
import com.fashion.backend.repository.OrderReturnRepository;
import com.fashion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderReturnService {

    private final OrderReturnRepository returnRepository;
    private final OrderRepository       orderRepository;
    private final UserRepository        userRepository;

    // ─────────────────────────────────────────────────────────────
    //  USER: Gửi yêu cầu hủy / đổi / trả
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public OrderReturnResponse submitRequest(OrderReturnRequest req) {

        // 1. Lấy đơn hàng
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + req.getOrderId()));

        // 2. Kiểm tra quyền (user chỉ thao tác đơn của mình)
        User currentUser = getCurrentUser();
        if (currentUser != null && order.getUser() != null
                && !order.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Bạn không có quyền thao tác đơn hàng này");
        }

        // 3. Kiểm tra nghiệp vụ theo loại yêu cầu
        String type = req.getType().toUpperCase();
        validateRequest(order, type);

        // 4. Kiểm tra chưa có yêu cầu đang pending/approved
        boolean alreadyPending = returnRepository.existsByOrderIdAndStatusIn(
                order.getId(),
                Arrays.asList(OrderReturnStatus.PENDING, OrderReturnStatus.APPROVED)
        );
        if (alreadyPending) {
            throw new RuntimeException("Đơn hàng này đã có yêu cầu đang chờ xử lý");
        }

        // 5. Nếu là CANCEL → tự động chuyển đơn sang CANCELLED ngay
        if ("CANCEL".equals(type)) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }

        // 6. Lưu yêu cầu
        OrderReturn returnReq = OrderReturn.builder()
                .returnCode(generateReturnCode())
                .order(order)
                .type(type)
                .reason(req.getReason())
                .description(req.getDescription())
                .exchangeSize(req.getExchangeSize())
                .exchangeColor(req.getExchangeColor())
                .imageUrls(req.getImageUrls())
                // CANCEL tự approve luôn; RETURN/EXCHANGE cần admin duyệt
                .status("CANCEL".equals(type) ? OrderReturnStatus.COMPLETED : OrderReturnStatus.PENDING)
                .build();

        OrderReturn saved = returnRepository.save(returnReq);
        log.info("📋 Return request [{}] submitted for order {} ({})", type, order.getOrderCode(), saved.getReturnCode());

        return toResponse(saved);
    }

    // ─────────────────────────────────────────────────────────────
    //  USER: Lấy danh sách yêu cầu của mình
    // ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OrderReturnResponse> getMyRequests() {
        User user = getCurrentUser();
        if (user == null) return List.of();
        return returnRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Lấy tất cả yêu cầu của 1 đơn hàng cụ thể */
    @Transactional(readOnly = true)
    public List<OrderReturnResponse> getByOrderId(Long orderId) {
        return returnRepository.findByOrderIdOrderByCreatedAtDesc(orderId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    //  ADMIN: Danh sách + duyệt / từ chối
    // ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<OrderReturnResponse> adminGetAll(String keyword, String status, int page, int size) {
        OrderReturnStatus statusEnum = null;
        if (status != null && !status.isBlank() && !"ALL".equals(status)) {
            try { statusEnum = OrderReturnStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }
        Pageable pageable = PageRequest.of(page, size);
        return returnRepository.findAdminReturns(statusEnum, keyword, pageable)
                .map(this::toResponse);
    }

    @Transactional
    public OrderReturnResponse adminUpdateStatus(Long id, String newStatus, String adminNote) {
        OrderReturn req = returnRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy yêu cầu #" + id));

        OrderReturnStatus statusEnum;
        try {
            statusEnum = OrderReturnStatus.valueOf(newStatus.toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + newStatus);
        }

        req.setStatus(statusEnum);
        if (adminNote != null && !adminNote.isBlank()) {
            req.setAdminNote(adminNote);
        }

        // Khi APPROVED một yêu cầu RETURN → không tự động hoàn hàng,
        // admin xử lý offline. Khi COMPLETED → đơn vẫn COMPLETED.
        // Khi admin APPROVED EXCHANGE → đơn sẽ được xử lý thủ công.

        OrderReturn saved = returnRepository.save(req);
        log.info("🔧 Return [{}] updated to {} by admin", saved.getReturnCode(), newStatus);
        return toResponse(saved);
    }

    // ─────────────────────────────────────────────────────────────
    //  Helpers
    // ─────────────────────────────────────────────────────────────

    private void validateRequest(Order order, String type) {
        OrderStatus status = order.getStatus();
        switch (type) {
            case "CANCEL" -> {
                if (status != OrderStatus.PENDING) {
                    throw new RuntimeException(
                            "Chỉ có thể hủy đơn hàng đang ở trạng thái 'Chờ xử lý'. " +
                                    "Đơn đang ở trạng thái: " + status.name()
                    );
                }
            }
            case "RETURN" -> {
                if (status != OrderStatus.COMPLETED) {
                    throw new RuntimeException(
                            "Chỉ có thể yêu cầu trả hàng khi đơn đã hoàn thành."
                    );
                }
            }
            case "EXCHANGE" -> {
                if (status != OrderStatus.COMPLETED) {
                    throw new RuntimeException(
                            "Chỉ có thể yêu cầu đổi hàng khi đơn đã hoàn thành."
                    );
                }
            }
            default -> throw new RuntimeException("Loại yêu cầu không hợp lệ: " + type);
        }
    }

    private String generateReturnCode() {
        long count = returnRepository.count() + 1;
        return String.format("RT-%06d", count);
    }

    private User getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                return userRepository.findByEmail(auth.getName()).orElse(null);
            }
        } catch (Exception ignored) {}
        return null;
    }

    private OrderReturnResponse toResponse(OrderReturn r) {
        return OrderReturnResponse.builder()
                .id(r.getId())
                .returnCode(r.getReturnCode())
                .orderId(r.getOrder().getId())
                .orderCode(r.getOrder().getOrderCode())
                .type(r.getType())
                .status(r.getStatus().name())
                .reason(r.getReason())
                .description(r.getDescription())
                .adminNote(r.getAdminNote())
                .exchangeSize(r.getExchangeSize())
                .exchangeColor(r.getExchangeColor())
                .imageUrls(r.getImageUrls())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}