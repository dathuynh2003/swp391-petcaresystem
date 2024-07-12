package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class SummaryData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int summaryId;
    private Date date;
    private double totalAmount;
    private double totalRefundAmount;
    private int totalBooking;
    private int totalCancelBooking;
    private int totalUser;
}
