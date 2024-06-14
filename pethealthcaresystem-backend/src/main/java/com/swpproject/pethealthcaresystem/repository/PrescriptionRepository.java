package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
}
