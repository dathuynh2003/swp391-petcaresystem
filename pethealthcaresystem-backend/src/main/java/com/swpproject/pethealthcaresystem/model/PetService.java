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
public class PetService {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private String nameService;
    private String description;
    private double price;
    private String img;
    private Boolean isActive = true;
//    @OneToMany(mappedBy = "petService", cascade = CascadeType.ALL)
//    private Set<BookingDetail> bookingDetails = new HashSet<>();

}
