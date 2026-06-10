package com.fashion.backend.service;

import com.fashion.backend.dto.AdminUserDto;
import com.fashion.backend.dto.VipStatsDto;
import com.fashion.backend.entity.User;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.OrderRepository;
import com.fashion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public Page<AdminUserDto> getUsers(String keyword, String tier, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;
        if (keyword != null && !keyword.isBlank()) {
            users = userRepository.findCustomersByKeyword(keyword.toLowerCase(), pageable);
        } else {
            users = userRepository.findAllCustomers(pageable);
        }

        // Filter by tier if provided
        if (tier != null && !tier.isBlank() && !"ALL".equals(tier)) {
            List<AdminUserDto> filtered = users.stream()
                    .map(this::toDto)
                    .filter(dto -> tier.equals(dto.getVipTier()))
                    .collect(java.util.stream.Collectors.toList());
            return new PageImpl<>(filtered, pageable, users.getTotalElements());
        }

        return users.map(this::toDto);
    }

    public Page<AdminUserDto> getStaffs(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> staff;
        if (keyword != null && !keyword.isBlank()) {
            staff = userRepository.findStaffByKeyword(keyword.toLowerCase(), pageable);
        } else {
            staff = userRepository.findAllStaff(pageable);
        }

        return staff.map(this::toDto);
    }

    public VipStatsDto getVipStats() {
        // Lấy tổng doanh thu từ tất cả đơn hàng thành công (bao gồm cả khách lẻ/không login)
        BigDecimal totalRevenue = orderRepository.sumAllTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        // Thống kê số lượng khách hàng theo hạng (chỉ tính những người có tài khoản)
        List<User> allUsers = userRepository.findAll();

        long diamond = 0, platinum = 0, gold = 0, silver = 0;
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        long newVipsThisMonth = 0;

        for (User u : allUsers) {
            BigDecimal spent = orderRepository.sumTotalSpentByUserId(u.getId());
            if (spent == null) spent = BigDecimal.ZERO;

            String tier = calculateTier(spent);
            if (!"NONE".equals(tier)) {
                if (u.getCreatedAt() != null && u.getCreatedAt().isAfter(startOfMonth)) {
                    newVipsThisMonth++;
                }

                switch (tier) {
                    case "DIAMOND" -> diamond++;
                    case "PLATINUM" -> platinum++;
                    case "GOLD" -> gold++;
                    case "SILVER" -> silver++;
                }
            }
        }

        return VipStatsDto.builder()
                .totalCustomerRevenue(totalRevenue)
                .totalVipRevenue(totalRevenue)
                .revenueGrowthPercent(new BigDecimal("12.4"))
                .newVipMembersThisMonth(newVipsThisMonth)
                .diamondCount(diamond)
                .platinumCount(platinum)
                .goldCount(gold)
                .silverCount(silver)
                .build();
    }

    private String calculateTier(BigDecimal totalSpent) {
        if (totalSpent.compareTo(new BigDecimal("5000000")) >= 0) return "DIAMOND";
        if (totalSpent.compareTo(new BigDecimal("4000000")) >= 0) return "PLATINUM";
        if (totalSpent.compareTo(new BigDecimal("3000000")) >= 0) return "GOLD";
        if (totalSpent.compareTo(new BigDecimal("2000000")) >= 0) return "SILVER";
        return "NONE";
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

        String vipTier = calculateTier(totalSpent);

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