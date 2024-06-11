package com.swpproject.pethealthcaresystem.model;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Hospitalization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String admissionTime;   //Time admitted from Clinic
    String dischargeTime;   //Time discharged from Clinic
    double price;           // price per hour (Get from cage's price)
    // Total = (dischargeTime - admissionTime) * (price per hour)
    String status;          //admitted, discharged

    @ManyToOne
    @JoinColumn(name = "pet_id")
    Pet pet;

    @ManyToOne
    @JoinColumn(name = "cage_id")
    Cage cage;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    User user;
}
