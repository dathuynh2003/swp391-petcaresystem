package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {

}
