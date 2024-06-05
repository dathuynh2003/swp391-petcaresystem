package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BookingDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private PetService petService;
}
