package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Booking {
    @Id
    private int booking_id;
    private int user_id;
    private int vs_id; //vs:vet shift
    private Date booking_date;
    private Date appointment_date;
    private String status;
    private double total_amount;
    private boolean type;
}
