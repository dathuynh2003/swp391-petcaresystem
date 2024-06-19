package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

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
}
