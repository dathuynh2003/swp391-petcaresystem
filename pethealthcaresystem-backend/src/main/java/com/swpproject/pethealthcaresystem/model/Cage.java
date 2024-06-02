package com.swpproject.pethealthcaresystem.model;

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
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Entity
public class Cage {
    @Id
    int id;
    Boolean status;
    String description;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    User user;

    @OneToMany(mappedBy = "cage", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<HospitalizationRecord> hospitalizationRecords = new HashSet<>();
}
