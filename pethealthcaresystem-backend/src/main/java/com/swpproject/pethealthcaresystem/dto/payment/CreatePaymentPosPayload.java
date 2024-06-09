package com.swpproject.pethealthcaresystem.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePaymentPosPayload {
    private int orderCode;
    private int amount;
    private String description;
    private String buyerName;
    private String buyerEmail;
    private String buyerPhone;
    private String buyerAddress;
    private List<Map<String, Object>> items;
    private String cancelUrl;
    private String returnUrl;
    private String signature;
}
