package com.swpproject.pethealthcaresystem.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayOsData {
    private String bin;
    private String accountNumber;
    private String accountName;
    private String currency;
    private String paymentLinkId;
    private int amount;
    private String description;
    private int orderCode;
    private String status;
    private String checkoutUrl;
    private String qrCode;
}
