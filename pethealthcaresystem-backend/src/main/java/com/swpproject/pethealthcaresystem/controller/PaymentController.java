package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.dto.payment.CreatePaymentPosPayload;
import com.swpproject.pethealthcaresystem.dto.payment.PayOsDTO;
import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.ExcelExportService;
import com.swpproject.pethealthcaresystem.service.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.util.ParameterMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")

public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/create")
    public ResponseEntity<ResponseData> createPayment(HttpSession session,@RequestBody Payment payment) {
        try {
            User user = (User) session.getAttribute("user");
            if (user != null) {
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
            }
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Error e) {
            ResponseData<PayOsDTO> data = new ResponseData();
            data.setErrorMessage("Payment failed");
            data.setStatusCode(404);
            return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/payment-update")
    public ResponseEntity<ResponseData> updatePayment(HttpSession session,@RequestBody Payment payment) {
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

    @PostMapping("/generate-payment/hospitalization/{hospId}")
    public Map<String, Object> createHospitalizationPayment(@RequestBody Payment payment, @PathVariable int hospId, HttpSession session) {
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
            Map<String, Object> payload = paymentService.createPayLoad(payment, hospId);
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

    //Chưa biết dùng làm gì. Chỉ get ra để test ở PostMan
    @GetMapping("/payment/info/{orderCode}")
    public Map<String, Object> getPaymentByOrderCode(@PathVariable int orderCode, HttpSession session) {
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
            HttpEntity<String> httpEntity = new HttpEntity<>(headers);
            var result = restTemplate.exchange
                    ("https://api-merchant.payos.vn/v2/payment-requests/" + orderCode, HttpMethod.GET, httpEntity, Map.class);

            // Thêm kết quả vào response
            response.put("message", "Payment information retrieved successfully");
            response.put("result", result.getBody());
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/update-payment/{orderCode}")
    public Map<String, Object> updatePayment(@PathVariable int orderCode, @RequestBody Payment payment, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        System.out.println("Payment:" + payment);
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            Payment updatedPayment = paymentService.updatePayment(orderCode, payment);
            response.put("payment", updatedPayment);
            response.put("message", "Payment updated successfully");
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/generate-payment/medicalRecord/{medicalRecordId}")
    public Map<String, Object> createMedicalRecordPayment(@RequestBody Payment payment, @PathVariable int medicalRecordId, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                response.put("message", "You need login first");
            }
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-client-id", PaymentService.clientId);
            headers.set("x-api-key", PaymentService.apiKey);

//            Payment payment1 = paymentService.createPayment(payment);

            Map<String, Object> payload = paymentService.createPayLoadMedicalRecord(payment, medicalRecordId);
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(payload, headers);
            var result = restTemplate.postForObject
                    ("https://api-merchant.payos.vn/v2/payment-requests", httpEntity, Map.class);


            response.put("message", "Payment created successfully");
            response.put("result", result);
        }catch (Exception e){
            response.put("message", e.getMessage());
        }
        return response;
    }
    @GetMapping("/payments/export")
    public void exportToExcel(HttpServletResponse response){
        try{
            response.setContentType("application/octet-stream");
            String headerKey = "Content-Disposition";
            String headerValue = "attachment; filename=payment.xlsx";
            response.setHeader(headerKey, headerValue);

            List<Payment> paymentList = paymentService.getPaymentList();
            ExcelExportService<Payment> excelExportService = new ExcelExportService<>(paymentList);

            excelExportService.exportPayment(response);
        }catch (IOException exception){
            exception.printStackTrace();
        }
    }



}
