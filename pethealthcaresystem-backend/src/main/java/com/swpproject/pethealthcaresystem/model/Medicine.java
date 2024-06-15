package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@EqualsAndHashCode(exclude = "prescriptions")
@Entity
public class Medicine {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    int id;
    String name;
    String description;
    double price;
    int quantity;
    String type;
    String unit;

    @OneToMany(mappedBy = "medicine", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<HospitalizationDetail> hospitalizationDetails = new HashSet<>();

    

}
