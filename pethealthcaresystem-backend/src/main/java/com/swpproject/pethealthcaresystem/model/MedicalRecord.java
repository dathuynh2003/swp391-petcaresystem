package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Entity
@EqualsAndHashCode(exclude = "prescriptions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MedicalRecord {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    int id;
    Date date;
    String diagnosis;
    String treatment;
    String vetNote;
    //String vaccine;
    double totalAmount;
    int status = 1;
    Boolean isPaid = false;
    @ManyToOne
    @JoinColumn(name = "vet_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    @JsonIgnoreProperties("medicalRecords")
    Pet pet;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Prescription> prescriptions = new HashSet<>();

}
