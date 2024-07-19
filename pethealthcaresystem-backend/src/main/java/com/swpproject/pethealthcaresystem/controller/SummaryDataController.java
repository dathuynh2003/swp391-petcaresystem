package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.SummaryData;
import com.swpproject.pethealthcaresystem.service.ExcelExportService;
import com.swpproject.pethealthcaresystem.service.SummaryDataService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/summary-data")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SummaryDataController {
    @Autowired
    private SummaryDataService summaryDataService;

    @GetMapping
    public List<SummaryData> getSummaryData(@RequestParam String startDate, @RequestParam String endDate) {
        try {
            Date start = Date.from(LocalDate.parse(startDate).atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date end = Date.from(LocalDate.parse(endDate).atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

            // Call the service method to fetch summary data for the specified date range
            return summaryDataService.getSummaryDataByDateRange(start, end);
        } catch (DateTimeParseException | IllegalArgumentException ex) {
            // Handle date parsing errors or invalid date format
            throw new IllegalArgumentException("Invalid date format or range: " + ex.getMessage());
        }
    }

    //cái này để update mấy cái ngày mà chưa thống kê, ví dụ từ ngày 2024-06-01 -> 2024-06-30
    //sử dụng postman: http://localhost:8080/api/summary-data/update-missing?fromDate=2024-06-01&toDate=2024-06-30
    @GetMapping("/update-missing")
    public String updateMissingSummaryData(@RequestParam String fromDate, @RequestParam String toDate) {
        Date start = Date.from(LocalDate.parse(fromDate).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date end = Date.from(LocalDate.parse(toDate).atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());
        summaryDataService.generateMissingSummaryData(start, end);
        return "Missing summary data updated";
    }

    @GetMapping("export")
    public void exportToExcel(HttpServletResponse response){
        try{
            response.setContentType("application/octet-stream");
            String headerKey = "Content-Disposition";
            String headerValue = "attachment; filename=summarydata.xlsx";
            response.setHeader(headerKey, headerValue);

            List<SummaryData> list = summaryDataService.getAllData();

            ExcelExportService<SummaryData> excelExportService = new ExcelExportService<>(list);

            excelExportService.exportSummaryData(response);

        }catch (IOException exception){
            exception.printStackTrace();
        }
    }
}
