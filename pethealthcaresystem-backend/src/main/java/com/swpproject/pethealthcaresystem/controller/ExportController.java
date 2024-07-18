package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.service.ExcelExportService;
import com.swpproject.pethealthcaresystem.service.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ExportController {
    @Autowired
    private ExcelExportService excelExportService;

    @Autowired
    private PaymentService paymentService;

//    @GetMapping("/payments")
//    public ResponseEntity<InputStreamResource> exportPaymentsToExcel() throws IOException {
//        try {
//            ByteArrayInputStream bais = excelExportService.exportPaymentsToExcel();
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=payments.xlsx");
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
//                    .body(new InputStreamResource(bais));
//        } catch (IOException e) {
//            // Log the exception or handle it as per your application's error handling strategy
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(null); // or return an appropriate error message or ResponseEntity
//        }
//    }


}


