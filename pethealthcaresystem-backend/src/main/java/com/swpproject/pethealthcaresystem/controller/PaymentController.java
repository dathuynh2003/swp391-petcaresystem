package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.dto.payment.CreatePaymentPosPayload;
import com.swpproject.pethealthcaresystem.dto.payment.PayOsDTO;
import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class PaymentController {

    @Autowired
    PaymentService paymentService;
    @PostMapping("/api/payment")
    public ResponseEntity<ResponseData> createPayment(@RequestBody Payment payment) {
        try{
            CreatePaymentPosPayload payload = paymentService.createPaymentOs(payment);
            ResponseData<PayOsDTO> data = new ResponseData();
            final String uri = "https://api-merchant.payos.vn/v2/payment-requests";
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-client-id", PaymentService.clientId);
            headers.set("x-api-key", PaymentService.apiKey);
            HttpEntity<CreatePaymentPosPayload> httpEntity = new HttpEntity<>(payload, headers);
            PayOsDTO result = restTemplate.postForObject(uri, httpEntity, PayOsDTO.class);
            data.setData(result);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch (Error e){
            ResponseData<PayOsDTO> data = new ResponseData();
            data.setErrorMessage("Payment failed");
            data.setStatusCode(404);
            return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
        }
    }
}
