package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VetShiftDetailRepository extends JpaRepository<VetShiftDetail, Integer> {
}
