package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.HospitalizationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface HospitalizationDetailRepository extends JpaRepository<HospitalizationDetail, Integer> {
    Set<HospitalizationDetail> findByHospitalizationOrderByTimeAsc(Hospitalization hospitalization);
}
