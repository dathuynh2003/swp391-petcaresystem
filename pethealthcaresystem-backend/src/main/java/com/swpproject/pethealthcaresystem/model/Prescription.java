package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Entity
@EqualsAndHashCode(exclude = {"medicalRecord", "medicine"})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    int dosage;
    String frequency;
    double price;

    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    @JsonIgnoreProperties("prescriptions")
    MedicalRecord medicalRecord;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    @JsonIgnoreProperties("prescriptions")
    Medicine medicine;

}
