package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.*;
import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.repository.*;
import com.swpproject.pethealthcaresystem.utils.SystemUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Set;

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
    @Autowired
    private UserRepository userRepository;


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
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by("id").descending());
        Page<Booking> bookings = bookingRepository.findAllBookingWithStatus(pageable);
        if (bookings.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        return bookings;
    }

    public Page<Booking> getBookingsByPhone(int pageNo, int pageSize, String phoneNumber) {
        User selectedUser = userRepository.findUserByPhoneNumber(phoneNumber);
        if (selectedUser == null) {
            throw new RuntimeException("User not found");
        }
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by("id").descending());
        return bookingRepository.findBookingsByUser(selectedUser, pageable);
    }

    @Override
    public Booking createBookingByUser(Booking newBooking, User user, int petId, int vsId, List<Integer> serviceIds) {
        Pet selectedPet = petRepository.findById(petId).orElseThrow(()
                -> new RuntimeException("Pet not found"));
        newBooking.setPet(selectedPet);

        User owner = selectedPet.getOwner();
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
        VetShiftDetail vetShiftDetail = vetShiftDetailRepository.findById(newBooking.getVetShiftDetail().getVs_id()).orElseThrow(()
                -> new RuntimeException("VetShift not found"));
        vetShiftDetail.setStatus("Available");
        vetShiftDetailRepository.save(vetShiftDetail);
        newBooking.setVetShiftDetail(vetShiftDetail);

        Booking updatedBooking = bookingRepository.findById(newBooking.getId()).orElseThrow(()
                -> new RuntimeException("Booking not found"));
        updatedBooking.setStatus("CANCELLED");
        updatedBooking = bookingRepository.save(updatedBooking);
        return updatedBooking;
    }

    @Override
    public Page<Booking> getBookingsByUserAndStatusIn(int userId, List<String> statuses, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by("bookingDate").descending());
        return bookingRepository.findByUserUserIdAndStatusIn(userId, statuses, pageable);
    }

    @Override
    public Page<Booking> getBookingsByStatus(String status, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by("id").descending());
        Page<Booking> bookings = bookingRepository.findByStatus(status, pageable);
        return bookings;
    }

    @Override
    public Page<Booking> getBookingByBookingDate(Date fromDate, Date toDate, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by("id").descending());
        Page<Booking> bookings = bookingRepository.findByBookingDateBetween(fromDate, toDate, pageable);
        return bookings;
    }

    @Override
    public Page<Booking> getBookingByStatusAndDate(String status, String fromDate, String toDate, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by("id").descending());
        if (fromDate != null && status == null) {
            Date from = SystemUtils.endOfDay(SystemUtils.parseStringToDate(fromDate));
            Date to = SystemUtils.endOfDay(SystemUtils.parseStringToDate(toDate));
            return bookingRepository.findByBookingDateBetween(from, to, pageable);
        } else if (status != null && fromDate != null) {
            Date from = SystemUtils.parseStringToDate(fromDate);
            Date to = SystemUtils.parseStringToDate(toDate);
            return bookingRepository.findByBookingDateBetweenAndStatus(from, to, status, pageable);
        }
        Page<Booking> bookings = bookingRepository.findByStatus(status, pageable);
        return bookings;
    }

    @Override
    public Booking requestRefundBooking(int id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        Date curDate = new Date();
        booking.setRefundDate(curDate);
        booking.setStatus("Request Refund");
        bookingRepository.save(booking);
        return booking;
    }

    @Override
    @Transactional
    public Booking acceptRefundBooking(int id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("Refunded");
        VetShiftDetail vetShiftDetail = booking.getVetShiftDetail();
        if (vetShiftDetail == null) {
            throw new RuntimeException("Vet Shift Detail not found. Cannot accept refund request");
        }
        vetShiftDetail.setStatus("Available");
        vetShiftDetailRepository.save(vetShiftDetail);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking refuseRefundBooking(int id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("PAID");
        booking.setRefundDate(null);
        //Có thể bổ sung thêm reason nhưng cần xem xét thêm field vào booking....
        return bookingRepository.save(booking);
    }

    @Override
    public Booking requestRefundBookingByStaff(int bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        VetShiftDetail vsDetail = booking.getVetShiftDetail();
        Shift shift = vsDetail.getShift();

        // Chuyển đổi thành LocalDate và LocalTime
        LocalDate localDate = LocalDate.parse(vsDetail.getDate());
        LocalTime startTime = LocalTime.parse(shift.getFrom_time());
        // Nối lại thành appoimentTime (ngày giờ khám)
        LocalDateTime appointmentTime = LocalDateTime.of(localDate, startTime);
        // Tạo một ngày mới nhỏ hơn 7 ngày
        LocalDateTime newDateTime = appointmentTime.minusDays(7);
        // Chuyển đổi LocalDateTime sang Date để lưu xuống DB
        Date refundDate = Date.from(newDateTime.atZone(ZoneId.systemDefault()).toInstant());

        booking.setRefundDate(refundDate);
        booking.setStatus("Request Refund");
        bookingRepository.save(booking);
        return booking;
    }

    @Override
    public Booking finishBooking(Booking completedBooking) {
        Booking curBooking = bookingRepository.findById(completedBooking.getId()).orElseThrow(() -> new RuntimeException("Booking not found"));
        curBooking.setStatus("DONE");
        if (completedBooking.getReVisitDate() != null) {
            curBooking.setReVisitDate(completedBooking.getReVisitDate());
        }
        return bookingRepository.save(curBooking);
    }

    @Override
    public Page<Booking> getUpcomingRevisitBookings(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by("reVisitDate").ascending());
        return bookingRepository.findUpComingRevisitBookings(pageable);
    }

}
