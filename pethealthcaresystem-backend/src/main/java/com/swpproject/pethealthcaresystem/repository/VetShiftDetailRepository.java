package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VetShiftDetailRepository extends JpaRepository<VetShiftDetail, Integer> {
    boolean existsByShiftShiftIdAndUserUserIdAndDate(int shiftId, int vetId, String date);

    Optional<VetShiftDetail> findByShiftShiftIdAndUserUserIdAndDate(Long shiftId, Long vetId, String date);
}
