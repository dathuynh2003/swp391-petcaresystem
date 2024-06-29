package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.SummaryData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface SummaryDataRepository extends JpaRepository<SummaryData, Integer> {
    List<SummaryData> findByDateBetween(Date startDate, Date endDate);
//    @Query("SELECT s.date FROM SummaryData s")
    SummaryData findByDate(Date date);
}
