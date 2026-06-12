package com.fashion.backend.service;

import com.fashion.backend.config.VNPayConfig;
import com.fashion.backend.dto.PaymentSettingsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminSettingsService {

    private final VNPayConfig vnPayConfig;

    public PaymentSettingsDto getPaymentSettings() {
        boolean hasTmnCode = isConfiguredValue(vnPayConfig.getTmnCode(), "YOUR_TMN_CODE");
        boolean hasSecret = isConfiguredValue(vnPayConfig.getHashSecret(), "YOUR_HASH_SECRET");
        boolean configured = hasTmnCode && hasSecret;

        return PaymentSettingsDto.builder()
                .gateway("VNPay")
                .configured(configured)
                .sandbox(vnPayConfig.getPaymentUrl() != null && vnPayConfig.getPaymentUrl().contains("sandbox"))
                .tmnCodeMasked(mask(vnPayConfig.getTmnCode()))
                .paymentUrl(vnPayConfig.getPaymentUrl())
                .returnUrl(vnPayConfig.getReturnUrl())
                .ipnUrl(vnPayConfig.getIpnUrl())
                .version(vnPayConfig.getVersion())
                .command(vnPayConfig.getCommand())
                .currencyCode(vnPayConfig.getCurrencyCode())
                .locale(vnPayConfig.getLocale())
                .build();
    }

    private boolean isConfiguredValue(String value, String fallback) {
        return value != null && !value.isBlank() && !fallback.equals(value);
    }

    private String mask(String value) {
        if (value == null || value.isBlank()) {
            return "Chưa cấu hình";
        }
        if (value.length() <= 6) {
            return "***";
        }
        return value.substring(0, 3) + "***" + value.substring(value.length() - 2);
    }
}