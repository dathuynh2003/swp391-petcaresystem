package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.SummaryData;
import com.swpproject.pethealthcaresystem.service.SummaryDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/summary-data")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SummaryDataController {
    @Autowired
    private SummaryDataService summaryDataService;

    @GetMapping
    public List<SummaryData> getSummaryData(@RequestParam String startDate, @RequestParam String endDate) {
        return summaryDataService.getSummaryDataByDateRange(startDate, endDate);
    }

    //cái này để thêm dữ liệu vào database để test thôi
    @PostMapping
    public SummaryData addSummaryData(@RequestBody SummaryData summaryData) {
        return summaryDataService.saveSummaryData(summaryData);
    }

    //cái này để update mấy cái ngày mà chưa thống kê, ví dụ từ ngày 2024-06-01 -> 2024-06-30
    //sử dụng postman: http://localhost:8080/api/summary-data/update-missing?fromDate=2024-06-01&toDate=2024-06-30
    @GetMapping("/update-missing")
    public String updateMissingSummaryData(@RequestParam String fromDate, @RequestParam String toDate) {
        LocalDate start = LocalDate.parse(fromDate);
        LocalDate end = LocalDate.parse(toDate);
        summaryDataService.generateMissingSummaryData(start, end);
        return "Missing summary data updated";
    }
}
