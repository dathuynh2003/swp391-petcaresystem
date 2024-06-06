package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.dto.payment.CreatePaymentPosPayload;
import com.swpproject.pethealthcaresystem.dto.payment.PayOsDTO;
import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class PaymentController {

    @Autowired
    PaymentService paymentService;
//    @GetMapping("/api/payment")
//    public void test(){
//        System.out.println("hihi");
//    }
    @PostMapping("/api/payment")
    public void createPayment(@RequestBody Payment payment) {
        System.out.println("hihi");
        CreatePaymentPosPayload payload = paymentService.createPaymentOs(payment);

        System.out.println(payload);

        final String uri = "https://api-merchant.payos.vn/v2/payment-requests";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-client-id", paymentService.clientId);
        headers.set("x-api-key", paymentService.apiKey);

        HttpEntity<CreatePaymentPosPayload> httpEntity = new HttpEntity<>(payload, headers);

        PayOsDTO result = restTemplate.postForObject(uri, httpEntity, PayOsDTO.class);

        System.out.println(result);
    }


}
