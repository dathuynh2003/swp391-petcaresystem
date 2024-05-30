package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VetShiftRepository extends JpaRepository<VetShiftDetail, Integer> {

}
