package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.HashSet;
import java.util.List;
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

    @OneToMany(mappedBy = "vetShiftDetail")
    @JsonIgnoreProperties("vetShiftDetail")
    private List<Booking> bookings;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    @JsonIgnoreProperties("vetShiftDetails")
    private User user;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    @JsonIgnoreProperties("vetShiftDetails")
    private Shift shift;

}
