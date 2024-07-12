package com.swpproject.pethealthcaresystem.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
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

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    int petId;
    String avatar;
    String name;
    String petType;
    String breed;
    String gender;
    Boolean isNeutered;
//    int age;
    Date dob;
    String description;
    Boolean isDeceased;


    @ManyToOne
    @JoinColumn(name = "owner_id")
    User owner;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<MedicalRecord> medicalRecords = new HashSet<>();

    @OneToMany(mappedBy = "pet")//, cascade = CascadeType.ALL, orphanRemoval = true
    @JsonIgnoreProperties("pet")
    Set<Hospitalization> hospitalizations = new HashSet<>();


}

