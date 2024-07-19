package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.model.SummaryData;
import com.swpproject.pethealthcaresystem.repository.BookingRepository;
import com.swpproject.pethealthcaresystem.repository.PaymentRepository;
import com.swpproject.pethealthcaresystem.repository.SummaryDataRepository;
import com.swpproject.pethealthcaresystem.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class SummaryDataService implements ISummaryDataService {
    @Autowired
    private SummaryDataRepository summaryDataRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostConstruct
    public void onStartup() {
        generateSummaryData();
    }

    @Scheduled(cron = "0 0 0 * * ?", zone = "Asia/Ho_Chi_Minh")  // Chạy hàng ngày vào lúc nửa đêm
    public void generateSummaryData() {
        // Lấy dữ liệu từ ngày hôm trước
        Date yesterday = Date.from(java.time.LocalDate.now().minusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date startDate = Date.from(yesterday.toInstant());
        Date endDate = Date.from(java.time.LocalDate.now().minusDays(1).atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        generateSummaryDataForDate(startDate, endDate);
    }

    @Override
    public void generateMissingSummaryData(Date fromDate, Date toDate) {

        // Convert the Date objects to LocalDate for easy iteration
        LocalDate start = fromDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate end = toDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        while (!start.isAfter(end)) {
            Date startDate = Date.from(start.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date endDate = Date.from(start.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

            generateSummaryDataForDate(startDate, endDate);
            start = start.plusDays(1);
        }
    }


    @Override
    public SummaryData generateSummaryDataForDate(Date startDate, Date endDate) {
        // Lấy dữ liệu từ các nguồn khác nhau và tính toán các giá trị tổng hợp
        List<Booking> bookings = bookingRepository.findByBookingDateBetween(startDate, endDate);
        List<Payment> payments = paymentRepository.findByPaymentDateBetween(startDate, endDate);

        long totalUsers = userRepository.countByRoleIdAndCreatedAtBetween(1, startDate, endDate);

        double totalAmount = payments.stream()
                .filter(payment -> "PAID".equals(payment.getStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();

        double totalRefundAmount = bookings.stream()
                .filter(booking -> "Refunded".equals(booking.getStatus()))
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        int totalBooking = (int) bookings.stream().filter(booking -> !"CANCELLED".equals(booking.getStatus())).count();

        int totalCancelBooking = (int) bookings.stream().filter(booking -> "Refunded".equals(booking.getStatus())).count();

        SummaryData newSummaryData = summaryDataRepository.findByDate(startDate);
        if (newSummaryData == null) {
            newSummaryData = new SummaryData();
            newSummaryData.setDate(startDate);
        }
        newSummaryData.setTotalAmount(totalAmount);
        newSummaryData.setTotalRefundAmount(totalRefundAmount);
        newSummaryData.setTotalBooking(totalBooking);
        newSummaryData.setTotalCancelBooking(totalCancelBooking);
        newSummaryData.setTotalUser((int) totalUsers);

        // Lưu đối tượng vào cơ sở dữ liệu
        return summaryDataRepository.save(newSummaryData);
    }

    @Override
    public List<SummaryData> getSummaryDataByDateRange(Date startDate, Date endDate) {
        return summaryDataRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    public List<SummaryData> getAllData() {
        List<SummaryData> list = summaryDataRepository.findAll();
        return list;
    }


}
