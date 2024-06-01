package com.swpproject.pethealthcaresystem.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "pet")

public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int petId;
//    @ManyToOne
//    @JoinColumn(name = "owner_id")
//    User owner;
    String avatar;
    String name;
    String petType;
    String breed;
    String gender;
    boolean isNeutered;
    int age;
    String description;
    boolean isDeceased;


    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Booking> bookings = new HashSet<>();



}

