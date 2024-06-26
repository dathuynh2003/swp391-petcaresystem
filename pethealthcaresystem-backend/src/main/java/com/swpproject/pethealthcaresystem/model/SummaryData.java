package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class SummaryData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int summaryId;
    private String date;
    private double totalAmount;
    private int totalBooking;
    private int totalUser;
}
