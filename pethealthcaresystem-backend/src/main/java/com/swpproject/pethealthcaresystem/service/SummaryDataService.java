package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.SummaryData;
import com.swpproject.pethealthcaresystem.repository.BookingRepository;
import com.swpproject.pethealthcaresystem.repository.SummaryDataRepository;
import com.swpproject.pethealthcaresystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SummaryDataService implements ISummaryDataService{
    @Autowired
    private SummaryDataRepository summaryDataRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    @Scheduled(cron = "0 0 0 * * ?")  // Chạy hàng ngày vào lúc nửa đêm
    public void generateSummaryData() {
        // Lấy dữ liệu từ ngày hôm trước
        LocalDate yesterday = LocalDate.now().minusDays(1);
        Date startDate = Date.from(yesterday.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(yesterday.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        generateSummaryDataForDate(startDate, endDate);
    }

    @Override
    public void generateMissingSummaryData(LocalDate fromDate, LocalDate toDate) {
        List<String> existingDates = summaryDataRepository.findAllDates();

        List<LocalDate> allDates = fromDate.datesUntil(toDate.plusDays(1)).collect(Collectors.toList());

        for (LocalDate date : allDates) {
            String formattedDate = date.format(DATE_FORMATTER);
            if (!existingDates.contains(formattedDate)) {
                Date startDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
                Date endDate = Date.from(date.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());
                generateSummaryDataForDate(startDate, endDate);
            }
        }
    }

    @Override
    public void generateSummaryDataForDate(Date startDate, Date endDate) {
        // Lấy dữ liệu từ các nguồn khác nhau và tính toán các giá trị tổng hợp
        List<Booking> bookings = bookingRepository.findByBookingDateBetween(startDate, endDate);
        long totalUsers = userRepository.count();

        double totalAmount = bookings.stream()
                .filter(booking -> !"CANCELLED".equals(booking.getStatus()))
                .mapToDouble(Booking::getTotalAmount)
                .sum();
        double totalRefundAmount = bookings.stream()
                .filter(booking -> "Refunded".equals(booking.getStatus()))
                .mapToDouble(Booking::getTotalAmount)
                .sum();
        int totalBooking = bookings.size();
        int totalCancelBooking = (int) bookings.stream().filter(booking -> "CANCELLED".equals(booking.getStatus())).count();

        // Tạo đối tượng SummaryData
        SummaryData summaryData = new SummaryData();
        LocalDate localDate = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.format(DATE_FORMATTER);
        summaryData.setDate(formattedDate);
        summaryData.setTotalAmount(totalAmount);
        summaryData.setTotalRefundAmount(totalRefundAmount);
        summaryData.setTotalBooking(totalBooking);
        summaryData.setTotalCancelBooking(totalCancelBooking);
        summaryData.setTotalUser((int) totalUsers);

        // Lưu đối tượng vào cơ sở dữ liệu
        summaryDataRepository.save(summaryData);
    }

    @Override
    public List<SummaryData> getSummaryDataByDateRange(String startDate, String endDate) {
        return summaryDataRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    public SummaryData saveSummaryData(SummaryData summaryData) {
        return summaryDataRepository.save(summaryData);
    }
}
