package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Booking {
    @Id
    private int id;
    private Date bookingDate;
    private Date appointmentDate;
    private String status;
    private double totalAmount;
    private boolean type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BookingDetail> bookingDetails = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "vs_id")
    private VetShiftDetail vetShiftDetail;



}
