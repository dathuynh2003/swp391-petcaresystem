package com.swpproject.pethealthcaresystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
@Data
@Entity
@Table(
        name = "Vet_Shift_Detail",
        schema = "pethealthcarev2"
)
public class VetShiftDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int vsId; //vet shift id


    @ManyToOne
    @JoinColumn(name = "user_id")

    private User user;


    @ManyToOne
    @JoinColumn(name = "shitf_id")
    @JsonIgnoreProperties("vetShiftDetails")
    private Shift shift;

    //Additional fields
    private Date date;
    private String status;
}
