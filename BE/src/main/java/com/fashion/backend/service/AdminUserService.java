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

import org.springframework.security.crypto.password.PasswordEncoder;
import com.fashion.backend.dto.RegisterRequest;
import java.util.List;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<AdminUserDto> getUsers(String keyword, String tier, int page, int size) {
        List<User> users;
        if (keyword != null && !keyword.isBlank()) {
            users = userRepository.findByKeyword(keyword.toLowerCase(), PageRequest.of(0, 10000, Sort.by("createdAt").descending())).getContent();
        } else {
            users = userRepository.findAll(Sort.by("createdAt").descending());
        }

        List<AdminUserDto> dtos = users.stream().map(this::toDto).toList();
        
        if (tier != null && !tier.equals("ALL")) {
            dtos = dtos.stream().filter(d -> tier.equals(d.getVipTier())).toList();
        }
        
        int start = Math.min((int)PageRequest.of(page, size).getOffset(), dtos.size());
        int end = Math.min((start + size), dtos.size());
        
        return new PageImpl<>(dtos.subList(start, end), PageRequest.of(page, size), dtos.size());
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

    @Transactional
    public void deleteCustomer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng #" + id));
        if ("ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Không thể xóa tài khoản Admin");
        }
        userRepository.delete(user);
    }

    @Transactional
    public AdminUserDto createUser(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (req.getPhone() != null && userRepository.existsByPhone(req.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }
        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole("USER");
        user.setIsActive(true);
        user.setIsVerified(true);
        user.setCreatedAt(java.time.LocalDateTime.now());
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

        String vipTier = "NONE";
        if (totalSpent.compareTo(BigDecimal.valueOf(50000000)) >= 0) vipTier = "DIAMOND";
        else if (totalSpent.compareTo(BigDecimal.valueOf(30000000)) >= 0) vipTier = "PLATINUM";
        else if (totalSpent.compareTo(BigDecimal.valueOf(15000000)) >= 0) vipTier = "GOLD";
        else if (totalSpent.compareTo(BigDecimal.valueOf(5000000)) >= 0) vipTier = "SILVER";

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
                .vipTier(vipTier)
                .build();
    }
}