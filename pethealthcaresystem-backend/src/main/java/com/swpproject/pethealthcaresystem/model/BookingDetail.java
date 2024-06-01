package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;

@Entity
public class BookingDetail {
    @Id
    private int id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private PetService petService;
}
