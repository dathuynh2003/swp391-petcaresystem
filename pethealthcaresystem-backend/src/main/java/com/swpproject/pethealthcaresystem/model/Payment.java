package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.sql.Timestamp;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int orderCode;
    private String paymentType;
    private double amount;
    private Date paymentDate;
    private String status;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("user")
    @Nullable
    private User user;

    @OneToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties("payment")
    private Booking booking;
    @OneToOne
    @JoinColumn(name = "hospitalization_id")
    @JsonIgnoreProperties("payment")
    private Hospitalization hospitalization;

    @OneToOne
    @JoinColumn(name = "medicalRecord_id")
    @JsonIgnoreProperties("payment")
    private MedicalRecord medicalRecord;
}
