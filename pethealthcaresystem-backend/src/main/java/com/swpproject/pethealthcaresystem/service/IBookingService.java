package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;

import java.util.List;

public interface IBookingService {
    Booking createBooking(Booking newBooking, User user, int petId, int vsId, List<Integer> serviceIds);
}
