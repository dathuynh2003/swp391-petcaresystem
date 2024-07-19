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

    private void writeHeaderRowForSummaryData() {
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


    private void writeHeaderRowForPayment() {
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

    private void writeDataRowForSummaryData() {
        int rowCount = 1;
        for (T t : list) {
            if (t instanceof SummaryData) {
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

    private void writeDataRowForPayment() {
        int rowCount = 1;
        for (T t : list) {
            if (t instanceof Payment) {
                Payment payment = (Payment) t;
                Row row = sheet.createRow(rowCount++);
                Cell cell = row.createCell(0);
                cell.setCellValue(payment.getId());

                cell = row.createCell(1);
                cell.setCellValue(payment.getOrderCode());

                cell = row.createCell(2);
                if (payment.getPaymentDate() != null) {
                    cell.setCellValue(payment.getPaymentDate().toString());
                } else {
                    cell.setCellValue("");
                }

                cell = row.createCell(3);
                cell.setCellValue(payment.getPaymentType());

                cell = row.createCell(4);
                cell.setCellValue(payment.getStatus());

                cell = row.createCell(5);
                cell.setCellValue(payment.getAmount());


            }
        }

    }

    public void exportSummaryData(HttpServletResponse response) throws IOException {
        writeHeaderRowForSummaryData();
        writeDataRowForSummaryData();

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();


    }

    public void exportPayment(HttpServletResponse response) throws IOException {
        writeHeaderRowForPayment();
        writeDataRowForPayment();

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();


    }

    @Autowired
    private PaymentRepository paymentRepository;


}
