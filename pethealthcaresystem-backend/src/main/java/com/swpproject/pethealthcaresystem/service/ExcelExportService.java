package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.model.SummaryData;
import com.swpproject.pethealthcaresystem.repository.PaymentRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelExportService<T> {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;

    private List<T> list;


    public ExcelExportService(List<T> list) {
        this.list = list;
        workbook = new XSSFWorkbook();
        sheet = workbook.createSheet("list");

    }
    private void writeHeaderRowForSummaryData(){
        Row row = sheet.createRow(0);

        Cell cell = row.createCell(0);
        cell.setCellValue("ID");

        cell = row.createCell(1);
        cell.setCellValue("Date");

        cell = row.createCell(2);
        cell.setCellValue("Total Amount");

        cell = row.createCell(3);
        cell.setCellValue("Total Booking(s)");

        cell = row.createCell(4);
        cell.setCellValue("Total Cancel Booking(s)");

        cell = row.createCell(5);
        cell.setCellValue("Total Refund Amount");

        cell = row.createCell(6);
        cell.setCellValue("Total User(s)");

    }



    private void writeHeaderRowForPayment(){
        Row row = sheet.createRow(0);

        Cell cell = row.createCell(0);
        cell.setCellValue("Payment ID");

        cell = row.createCell(1);
        cell.setCellValue("Order Code");

        cell = row.createCell(2);
        cell.setCellValue("Payment Date");

        cell = row.createCell(3);
        cell.setCellValue("Payment Type");

        cell = row.createCell(4);
        cell.setCellValue("Payment Status");

        cell = row.createCell(5);
        cell.setCellValue("Amount");





    }

    private void writeDataRowForSummaryData(){
        int rowCount = 1;
        for(T t: list){
            if(t instanceof SummaryData){
                SummaryData data = (SummaryData) t;
                Row row = sheet.createRow(rowCount++);
                Cell cell = row.createCell(0);
                cell.setCellValue(data.getSummaryId());

                cell = row.createCell(1);
                cell.setCellValue(data.getDate().toString());

                cell = row.createCell(2);
                cell.setCellValue(data.getTotalAmount());

                cell = row.createCell(3);
                cell.setCellValue(data.getTotalBooking());

                cell = row.createCell(4);
                cell.setCellValue(data.getTotalCancelBooking());

                cell = row.createCell(5);
                cell.setCellValue(data.getTotalRefundAmount());


                cell = row.createCell(6);
                cell.setCellValue(data.getTotalUser());


            }
        }

    }
    private void writeDataRowForPayment(){
        int rowCount = 1;
        for(T t: list){
            if(t instanceof Payment){
                Payment payment = (Payment) t;
                Row row = sheet.createRow(rowCount++);
                Cell cell = row.createCell(0);
                cell.setCellValue(payment.getId());

                cell = row.createCell(1);
                cell.setCellValue(payment.getOrderCode());

                cell = row.createCell(2);
                cell.setCellValue(payment.getPaymentDate().toString());

                cell = row.createCell(3);
                cell.setCellValue(payment.getPaymentType());

                cell = row.createCell(4);
                cell.setCellValue(payment.getStatus());

                cell = row.createCell(5);
                cell.setCellValue(payment.getBooking().getTotalAmount());

            }
        }

    }
    public void exportSummaryData(HttpServletResponse response) throws IOException {
        writeHeaderRowForSummaryData();
        writeDataRowForSummaryData();

        ServletOutputStream outputStream =  response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();


    }

    public void exportPayment(HttpServletResponse response) throws IOException {
        writeHeaderRowForPayment();
        writeDataRowForPayment();

        ServletOutputStream outputStream =  response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();


    }

    @Autowired
    private PaymentRepository paymentRepository;
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    public ByteArrayInputStream exportPaymentsToExcel() throws IOException {
        List<Payment> paymentList = paymentRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Payments");

            // Create header row
            String[] headers = {"ID", "Order Code", "Payment Type", "Amount","Payment Date", "Status", "Description"};
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < headers.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(headers[col]);
            }

            // Create data rows
            int rowIdx = 1;
            for (Payment payment : paymentList) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(payment.getId());
                row.createCell(1).setCellValue(payment.getOrderCode());
                row.createCell(2).setCellValue(payment.getPaymentType());
                row.createCell(3).setCellValue(payment.getAmount());
                row.createCell(4).setCellValue(payment.getPaymentDate());
                row.createCell(5).setCellValue(payment.getStatus());
                row.createCell(6).setCellValue(payment.getDescription());
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}
