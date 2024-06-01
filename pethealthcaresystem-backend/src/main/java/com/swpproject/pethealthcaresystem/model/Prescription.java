package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Entity
public class Prescription {
    @Id
    int id;
    int dosage;
    String frequency;
    double price;

    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    MedicalRecord medicalRecord;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    Medicine medicine;

}
