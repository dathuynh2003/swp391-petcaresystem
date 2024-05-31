package com.swpproject.pethealthcaresystem.model;
import jakarta.persistence.*;
import lombok.*;

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

    private int vet_id;
    private int shift_id;
    private String date;
    private String status;
    @ManyToOne
    @JoinColumn(name = "shitf_id")
    @JsonIgnoreProperties("vetShiftDetails")
    private Shift shift;
}
