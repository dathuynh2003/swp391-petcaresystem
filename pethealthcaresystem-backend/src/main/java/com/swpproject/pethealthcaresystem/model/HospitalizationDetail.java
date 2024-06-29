package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)

@Entity
public class HospitalizationDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String time;
    int dosage;
    String frequency;
    String description;
    double price;

    @ManyToOne
    @JoinColumn(name = "hospitalization_id")
    @JsonIgnoreProperties("hospitalizationDetails")
    Hospitalization hospitalization;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
//    @JsonIgnoreProperties("hospitalizationDetails")
    Medicine medicine;


}
