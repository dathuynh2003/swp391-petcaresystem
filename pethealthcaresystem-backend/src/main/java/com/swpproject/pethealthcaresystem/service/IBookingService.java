package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.*;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.List;
import java.util.Set;

public interface IBookingService {
    Booking createBooking(Booking newBooking, User user, int petId, int vsId, List<Integer> serviceIds);
    Booking updateBoking(Booking newBooking);
//    Booking getBookingByOrderCode(String orderCode);
    Booking createBookingByStaff(Booking newBooking, int petId, int vsId, List<Integer> serviceIds);
    Booking getBookingByID(int id);
    Booking updateBookingAfterPAID(Booking newBooking);
    Booking updateBookingAfterCANCELLED(Booking newBooking);
    List<Booking> getAllBookings(User currentUser);
    List<BookingDetail> bookingDetail(int bookingId);
    Page<Booking> getBookings(Integer pageNo, Integer pageSize);
    Page<Booking> getBookingsByPhone(int pageNo, int pageSize,String phoneNumber);
    Booking createBookingByUser(Booking newBooking, User user, int petId, int vsId, List<Integer> serviceIds);
//    Page<Booking> getBookingsByUserAndStatus(int userId, String status, int pageNo, int pageSize);
    Page<Booking> getBookingsByUserAndStatusIn(int userId, List<String> statuses, int pageNo, int pageSize);
    Page<Booking> getBookingsByStatus(String status, int pageNo, int pageSize);
    Page<Booking> getBookingByBookingDate(Date fromDate, Date toDate, int pageNo, int pageSize);
    Page<Booking> getBookingByStatusAndDate(String status, String fromDate, String toDate, int pageNo, int pageSize);
//    Page<Booking> getBookingByDateAndStatusAndPhoneNumber(Date fromDate,Date toDate, String status, String phoneNumber, int pageNo, int pageSize);
    Booking requestRefundBooking(int id);
    Booking acceptRefundBooking(int id);
    Booking refuseRefundBooking(int id, String reason);
    Booking requestRefundBookingByStaff(int bookingId);

    Booking finishBooking (Booking newBooking);

    Page<Booking> getUpcomingRevisitBookings(int pageNo, int pageSize);
 }
