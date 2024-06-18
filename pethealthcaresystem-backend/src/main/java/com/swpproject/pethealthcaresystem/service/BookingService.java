package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.*;
import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.repository.*;
//import com.swpproject.pethealthcaresystem.ultis.DateFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
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
    public Booking getBookingByID(int id) {
        Booking selectedBooking = bookingRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Booking not found"));
        return selectedBooking;
    }

    @Override
    public List<Booking> getAllBookings(User currentUser) {
        List<Booking> bookings = bookingRepository.findBookingsByUserAndStatus(currentUser, "PAID");
        if (bookings.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        return bookings;
    }

    @Override
    public List<BookingDetail> bookingDetail(int bookingId) {
        Booking selectedBooking = getBookingByID(bookingId);
        if (selectedBooking == null) {
            throw new RuntimeException("Booking not found");
        }
        List<BookingDetail> bookingDetails = selectedBooking.getBookingDetails();
        return bookingDetails;
    }

    @Override
    public Page<Booking> getBookings(Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<Booking> bookings = bookingRepository.findAll(pageable);
        if (bookings.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        return bookings;
    }

    @Override
    public Booking createBookingByStaff(Booking newBooking, int petId, int vsId, List<Integer> serviceIds) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        newBooking.setPet(pet);

        User owner = pet.getOwner();
        newBooking.setUser(owner);

        VetShiftDetail vetShiftDetail = vetShiftDetailRepository.findById(vsId).orElseThrow(() -> new RuntimeException("VetShift not found"));
        vetShiftDetail.setStatus("Waiting");
        vetShiftDetailRepository.save(vetShiftDetail);
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
    public Booking updateBookingAfterPAID(Booking newBooking) {
        VetShiftDetail vetShiftDetail = vetShiftDetailRepository.findById(newBooking.getVetShiftDetail().getVs_id()).orElseThrow(() -> new RuntimeException("VetShift not found"));
        vetShiftDetail.setStatus("Booked");
        vetShiftDetailRepository.save(vetShiftDetail);
        newBooking.setVetShiftDetail(vetShiftDetail);

        Booking updatedBooking = bookingRepository.findById(newBooking.getId()).orElseThrow(()
                -> new RuntimeException("Booking not found"));
        updatedBooking.setStatus("PAID");
        updatedBooking = bookingRepository.save(updatedBooking);
        return updatedBooking;
    }

    @Override
    public Booking updateBookingAfterCANCELLED(Booking newBooking) {
        VetShiftDetail vetShiftDetail = vetShiftDetailRepository.findById(newBooking.getVetShiftDetail().getVs_id()).orElseThrow(() -> new RuntimeException("VetShift not found"));
        vetShiftDetail.setStatus("Available");
        vetShiftDetailRepository.save(vetShiftDetail);
        newBooking.setVetShiftDetail(vetShiftDetail);

        Booking updatedBooking = bookingRepository.findById(newBooking.getId()).orElseThrow(()
                -> new RuntimeException("Booking not found"));
        updatedBooking.setStatus("CANCELLED");
        updatedBooking = bookingRepository.save(updatedBooking);
        return updatedBooking;
    }
}
