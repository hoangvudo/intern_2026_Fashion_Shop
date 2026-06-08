package com.fashion.backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class VNPayConfig {

    /** Điền vào application.yml:
     *  vnpay:
     *    tmn-code: YOUR_TMN_CODE
     *    hash-secret: YOUR_HASH_SECRET
     *    url: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
     *    return-url: http://localhost:8080/api/orders/vnpay/return
     *    ipn-url: http://YOUR_PUBLIC_IP/api/orders/vnpay/ipn
     *    version: "2.1.0"
     *    command: pay
     *    currency-code: VND
     *    locale: vn
     */
    @Value("${vnpay.tmn-code:YOUR_TMN_CODE}")
    private String tmnCode;

    @Value("${vnpay.hash-secret:YOUR_HASH_SECRET}")
    private String hashSecret;

    @Value("${vnpay.url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String paymentUrl;

    @Value("${vnpay.return-url:http://localhost:8080/api/orders/vnpay/return}")
    private String returnUrl;

    @Value("${vnpay.ipn-url:http://localhost:8080/api/orders/vnpay/ipn}")
    private String ipnUrl;

    @Value("${vnpay.version:2.1.0}")
    private String version;

    @Value("${vnpay.command:pay}")
    private String command;

    @Value("${vnpay.currency-code:VND}")
    private String currencyCode;

    @Value("${vnpay.locale:vn}")
    private String locale;
}