package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Entity
public class MedicalRecord {
    @Id
    int id;
    Date date;
    String diagnosis;
    String treatment;
    String vetNote;
    //String vaccine;
    double totalAmount;
    int status;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    Pet pet;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Prescription> prescriptions = new HashSet<>();

}
