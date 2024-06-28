package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.SummaryData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SummaryDataRepository extends JpaRepository<SummaryData, Integer> {
    List<SummaryData> findByDateBetween(String startDate, String endDate);
    @Query("SELECT s.date FROM SummaryData s")
    List<String> findAllDates();
    SummaryData findByDate(String date);
}
