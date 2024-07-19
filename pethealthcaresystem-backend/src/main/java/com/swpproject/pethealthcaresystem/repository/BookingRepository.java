package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Page<Booking> findBookingsByUser(User user, Pageable pageable);
    List<Booking> findBookingsByUserAndStatus(User user, String status);
    Page<Booking> findByUserUserIdAndStatusIn(int userId, List<String> statuses, Pageable pageable);
    Page<Booking> findByStatus(String status, Pageable pageable);
    Page<Booking> findByBookingDateBetween(Date fromDate, Date toDate, Pageable pageable);
    Page<Booking> findByBookingDateBetweenAndStatus(Date fromDate, Date toDate, String status, Pageable pageable);
    Page<Booking> findByStatusAndBookingDateBetweenAndUserPhoneNumber(String status, Date fromDate, Date toDate, String phoneNumber, Pageable pageable);
    List<Booking> findByBookingDateBetween(Date startDate, Date endDate);
    Set<Booking> findBookingsByPet(Pet pet);

    //Lấy những booking có reVisitDate lớn hơn curDate
    @Query("SELECT b FROM Booking b WHERE b.reVisitDate > CURRENT_DATE")
    Page<Booking> findUpComingRevisitBookings(Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.status IN ('PAID', 'Request Refund', 'Refunded', 'DONE', 'Checked_In')")
    Page<Booking> findAllBookingWithStatus(Pageable pageable);

}
