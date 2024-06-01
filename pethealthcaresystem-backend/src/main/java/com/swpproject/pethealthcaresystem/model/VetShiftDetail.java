package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "vet_shift_detail",
        schema = "pethealthcare"
)
public class VetShiftDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int vs_id;

    //private int vet_id;
    //private int shift_id;
    private String date;
    private String status;

    @OneToMany(mappedBy = "vetShiftDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Booking> bookings = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "vet_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    private Shift shift;
}
