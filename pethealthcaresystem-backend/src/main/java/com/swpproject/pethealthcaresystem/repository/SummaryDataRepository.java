package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.SummaryData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SummaryDataRepository extends JpaRepository<SummaryData, Integer> {
    List<SummaryData> findByDate(String date);
}
