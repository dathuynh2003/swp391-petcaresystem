package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.dto.payment.CreatePaymentPosPayload;
import com.swpproject.pethealthcaresystem.dto.payment.PayOsDTO;
import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.PaymentService;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.util.ParameterMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @PostMapping("/api/payment/create")
    public ResponseEntity<ResponseData> createPayment(@RequestBody Payment payment) {
        try {
            System.out.println(payment);
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
            payment.setOrderCode(result.getData().getOrderCode());
            paymentService.createPayment(payment);

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Error e) {
            ResponseData<PayOsDTO> data = new ResponseData();
            data.setErrorMessage("Payment failed");
            data.setStatusCode(404);
            return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/payment-update")
    public ResponseEntity<ResponseData> updatePayment(@RequestBody Payment payment) {
        try {
            ResponseData<Payment> data = new ResponseData();
            Payment updatedPayment = paymentService.updatePayment(payment);
            data.setStatusCode(200);
            data.setData(updatedPayment);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Error e) {
            ResponseData<Payment> data = new ResponseData();
            data.setErrorMessage(e.getMessage());
            data.setStatusCode(404);
            return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/payment/{orderCode}")
    public ResponseEntity<ResponseData> getPayment(@PathVariable int orderCode) {
        try {
            ResponseData<Payment> data = new ResponseData();
            Payment selectedPayment = paymentService.getPaymentByOrderCode(orderCode);
            data.setData(selectedPayment);
            data.setStatusCode(200);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Error e) {
            ResponseData<Payment> data = new ResponseData();
            data.setErrorMessage(e.getMessage());
            data.setStatusCode(404);
            return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/hospitalization/payment/create")
    public Map<String, Object> createHospitalizationPayment(@RequestBody Payment payment, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-client-id", PaymentService.clientId);
            headers.set("x-api-key", PaymentService.apiKey);
            Map<String, Object> payload = paymentService.createPayLoad(payment);
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(payload, headers);
            var result = restTemplate.postForObject
                    ("https://api-merchant.payos.vn/v2/payment-requests", httpEntity, Map.class);

            response.put("message", "Payment created successfully");
            response.put("result", result);
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }
}
