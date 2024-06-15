package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.*;
import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private VetShiftDetailRepository vetShiftDetailRepository;
    @Autowired
    private PetServiceRepository petServiceRepository;
    @Autowired
    private BookingDetailRepository bookingDetailRepository;


    @Override
    public Booking createBooking(Booking newBooking, User user, int petId, int vsId, List<Integer> serviceIds) {
        newBooking.setUser(user);

        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        newBooking.setPet(pet);

        VetShiftDetail vetShiftDetail = vetShiftDetailRepository.findById(vsId).orElseThrow(() -> new RuntimeException("VetShift not found"));
        newBooking.setVetShiftDetail(vetShiftDetail);

        Date curDate = new Date();
        newBooking.setBookingDate(curDate);
        newBooking.setStatus("Pending");
        bookingRepository.save(newBooking);

        for (Integer serviceId : serviceIds) {
            BookingDetail bookingDetail = new BookingDetail();
            PetService petService = petServiceRepository.findById(serviceId).orElseThrow(() -> new RuntimeException("Pet Service not found"));
            bookingDetail.setBooking(newBooking);
            bookingDetail.setPetService(petService);
            bookingDetailRepository.save(bookingDetail);
            newBooking.setTotalAmount(newBooking.getTotalAmount() + petService.getPrice());
        }
        return bookingRepository.save(newBooking);
    }

    @Override
    public Booking updateBoking(Booking newBooking) {
        Booking updatedBooking = bookingRepository.findById(newBooking.getId()).orElseThrow(()
                -> new RuntimeException("Booking not found"));
        updatedBooking.setStatus(newBooking.getStatus());
        updatedBooking = bookingRepository.save(updatedBooking);
        return updatedBooking;
    }

    @Override
    public Booking getBookingByOrderCode(String orderCode) {
        return null;
    }
}
