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

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)

@Entity
public class HospitalizationDetail {
    @Id
    int id;
    String time;
    int dosage;
    String frequency;
    String description;
    double price;

    @ManyToOne
    @JoinColumn(name = "hospitalization_id")
    HospitalizationRecord hospitalizationRecord;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    Medicine medicine;




}
