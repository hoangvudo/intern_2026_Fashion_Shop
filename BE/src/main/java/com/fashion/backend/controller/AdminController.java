package com.fashion.backend.controller;

import com.fashion.backend.dto.AdminOrderDto;
import com.fashion.backend.dto.AdminUserDto;
import com.fashion.backend.dto.BestSellerDto;
import com.fashion.backend.dto.DashboardStatsDto;
import com.fashion.backend.dto.PaymentSettingsDto;
import com.fashion.backend.dto.RecentOrderDto;
import com.fashion.backend.dto.ReportDataDto;
import com.fashion.backend.dto.RevenueDataDto;
import com.fashion.backend.dto.VipStatsDto;
import com.fashion.backend.service.AdminSettingsService;
import com.fashion.backend.service.AdminDashboardService;
import com.fashion.backend.service.AdminOrderService;
import com.fashion.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminDashboardService dashboardService;
    private final AdminOrderService adminOrderService;
    private final AdminUserService adminUserService;
    private final AdminSettingsService adminSettingsService;

    // ── Dashboard ────────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDataDto>> getRevenue(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(dashboardService.getRevenue(period));
    }

    @GetMapping("/reports")
    public ResponseEntity<ReportDataDto> getReportData() {
        return ResponseEntity.ok(dashboardService.getReportData());
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<BestSellerDto>> getBestSellers() {
        return ResponseEntity.ok(dashboardService.getBestSellers());
    }

    @GetMapping("/orders/recent")
    public ResponseEntity<List<RecentOrderDto>> getRecentOrders() {
        return ResponseEntity.ok(dashboardService.getRecentOrders());
    }

    // ── Orders ───────────────────────────────────────────────
    @GetMapping("/orders")
    public ResponseEntity<Page<AdminOrderDto>> getOrders(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminOrderService.getOrders(keyword, status, page, size));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<AdminOrderDto> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.getOrderDetail(id));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<AdminOrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return ResponseEntity.ok(adminOrderService.updateStatus(id, newStatus));
    }

    // ── Users / Customers ────────────────────────────────────
    @GetMapping("/customers")
    public ResponseEntity<Page<AdminUserDto>> getCustomers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "ALL") String tier,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminUserService.getUsers(keyword, tier, page, size));
    }

    @GetMapping("/customers/vip-stats")
    public ResponseEntity<VipStatsDto> getVipStats() {
        return ResponseEntity.ok(adminUserService.getVipStats());
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<AdminUserDto> getCustomerDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.getUserDetail(id));
    }

    @PatchMapping("/customers/{id}/toggle-active")
    public ResponseEntity<AdminUserDto> toggleCustomerActive(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.toggleActive(id));
    }

    @GetMapping("/staff")
    public ResponseEntity<Page<AdminUserDto>> getStaff(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminUserService.getStaffs(keyword, page, size));
    }

    @PatchMapping("/staff/{id}/toggle-active")
    public ResponseEntity<AdminUserDto> toggleStaffActive(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.toggleActive(id));
    }

    @GetMapping("/settings/payment")
    public ResponseEntity<PaymentSettingsDto> getPaymentSettings() {
        return ResponseEntity.ok(adminSettingsService.getPaymentSettings());
    }
}