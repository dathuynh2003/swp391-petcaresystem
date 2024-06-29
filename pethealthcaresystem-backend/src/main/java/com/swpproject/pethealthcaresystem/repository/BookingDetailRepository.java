package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer> {

}
