package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String paymentDate;
    private String status;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("user")
    private User user;

    @OneToOne
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
