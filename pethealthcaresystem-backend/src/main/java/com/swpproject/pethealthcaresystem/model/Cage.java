package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @NotBlank
    String name;
    String size;    //Small, Medium, Large
    String type;    //for petType (Dog, Cat, Bird, ...) All;
    double price; //price per hour
    String status;  //available, occupied
    String description;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    @JsonIgnoreProperties("cages")
    User user;

    @OneToMany(mappedBy = "cage", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Hospitalization> hospitalizations = new HashSet<>();
}
