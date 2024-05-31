package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "petservice"
)
public class PetService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String description;
    private double price;

    @OneToMany(mappedBy = "petService", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BookingDetail> bookingDetails = new HashSet<BookingDetail>();
}
