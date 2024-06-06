package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Date bookingDate;
    private Date appointmentDate;
    private String status;
    private double totalAmount;
    private Boolean type;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingDetail> bookingDetails = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "vs_id")
    private VetShiftDetail vetShiftDetail;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;


}
