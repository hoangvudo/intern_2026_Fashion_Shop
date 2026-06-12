package com.fashion.backend.service;

import com.fashion.backend.dto.AdminUserDto;
import com.fashion.backend.entity.User;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.OrderRepository;
import com.fashion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public Page<AdminUserDto> getUsers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;
        if (keyword != null && !keyword.isBlank()) {
            users = userRepository.findByKeyword(keyword.toLowerCase(), pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(this::toDto);
    }

    public AdminUserDto getUserDetail(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng #" + id));
        return toDto(user);
    }

    @Transactional
    public AdminUserDto toggleActive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng #" + id));
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        return toDto(userRepository.save(user));
    }

    private AdminUserDto toDto(User u) {
        Long totalOrders = 0L;
        BigDecimal totalSpent = BigDecimal.ZERO;
        try {
            totalOrders = orderRepository.countByUserId(u.getId());
            totalSpent = orderRepository.sumTotalSpentByUserId(u.getId());
            if (totalSpent == null) totalSpent = BigDecimal.ZERO;
        } catch (Exception ignored) {}

        return AdminUserDto.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .isActive(Boolean.TRUE.equals(u.getIsActive()))
                .isVerified(Boolean.TRUE.equals(u.getIsVerified()))
                .createdAt(u.getCreatedAt())
                .totalOrders(totalOrders)
                .totalSpent(totalSpent)
                .build();
    }
}
