package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftRepository extends JpaRepository<Shift, Integer> {
}
