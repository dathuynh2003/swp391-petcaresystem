package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class BookingDetail {
    @Id
    private int id;

    @ManyToOne
    @JoinColumn(name = "petService_id")
    private PetService petService;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private int quantity;
}
