package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Page<Booking> findBookingsByUser(User user, Pageable pageable);
    List<Booking> findBookingsByUserAndStatus(User user, String status);
    Page<Booking> findByUserUserIdAndStatus(int userId, String status, Pageable pageable);
    Page<Booking> findByStatus(String status, Pageable pageable);
    Page<Booking> findByBookingDateBetween(Date fromDate, Date toDate, Pageable pageable);
}
