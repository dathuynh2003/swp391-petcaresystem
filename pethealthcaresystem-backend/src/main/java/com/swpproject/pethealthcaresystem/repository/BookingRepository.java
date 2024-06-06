package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

}
