package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonIgnoreProperties("bookingDetails")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonIgnoreProperties("bookingDetails")
    private PetService petService;

}
