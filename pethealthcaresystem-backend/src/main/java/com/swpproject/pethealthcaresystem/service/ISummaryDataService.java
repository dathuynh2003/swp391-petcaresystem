package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.SummaryData;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface ISummaryDataService {
    void generateMissingSummaryData(LocalDate fromDate, LocalDate toDate);

    SummaryData generateSummaryDataForDate(Date startDate, Date endDate);

    List<SummaryData> getSummaryDataByDateRange(String startDate, String endDate);

    SummaryData saveSummaryData(SummaryData summaryData);

    
}
