package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "booking_date")
    private Date bookingDate;
    private Date refundDate;
    private Date reVisitDate;
    private String status;
    private double totalAmount;
    private String description;
    private int paymentId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    @JsonIgnoreProperties("bookings")
    private Pet pet;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingDetail> bookingDetails = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "vs_id")
    @JsonIgnoreProperties("bookings")
    private VetShiftDetail vetShiftDetail;

//    @OneToOne(mappedBy = "booking")
//    @JsonIgnoreProperties("booking")
//    private Payment payment;
}
