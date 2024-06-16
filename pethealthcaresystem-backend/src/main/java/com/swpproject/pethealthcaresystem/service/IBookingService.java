package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.*;

import java.util.List;

public interface IBookingService {
    Booking createBooking(Booking newBooking, User user, int petId, int vsId, List<Integer> serviceIds);
    Booking updateBoking(Booking newBooking);
//    Booking getBookingByOrderCode(String orderCode);
    Booking createBookingByStaff(Booking newBooking, int petId, int vsId, List<Integer> serviceIds);
     Booking getBookingByID(int id);
     List<Booking> getAllBookings(User currentUser);
     List<BookingDetail> bookingDetail(int bookingId);
}
