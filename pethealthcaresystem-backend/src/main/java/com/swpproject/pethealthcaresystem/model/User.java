package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "User",schema = "pethealthcare")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;
    private String email;
    private String password;
    private String full_name;
    private String phone_number;
    private String address;
    private int role_id;
    private String avatar;
    private String gender;
    private Boolean status;
    private Date dob;
    //A user(Vet) can have many shifts
    @ManyToMany
    List<Shift> shifts;
}
