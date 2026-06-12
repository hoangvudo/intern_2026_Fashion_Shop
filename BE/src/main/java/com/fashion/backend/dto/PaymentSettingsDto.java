package com.fashion.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentSettingsDto {
    private String gateway;
    private Boolean configured;
    private Boolean sandbox;
    private String tmnCodeMasked;
    private String paymentUrl;
    private String returnUrl;
    private String ipnUrl;
    private String version;
    private String command;
    private String currencyCode;
    private String locale;
}