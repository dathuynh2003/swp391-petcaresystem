package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.SummaryData;

import java.util.*;


public interface ISummaryDataService {
    void generateMissingSummaryData(Date fromDate, Date toDate);

    SummaryData generateSummaryDataForDate(Date startDate, Date endDate);

    List<SummaryData> getSummaryDataByDateRange(Date startDate, Date endDate);

    List<SummaryData> getAllData();
}
