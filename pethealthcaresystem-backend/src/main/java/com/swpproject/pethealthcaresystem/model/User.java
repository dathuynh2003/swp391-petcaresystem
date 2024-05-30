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
    private int userId;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private String address;
    private int roleId;
    private String avatar;
    private String gender;
    private Boolean status;
    private Date dob;
    //A user(Vet) can have many shifts
    @ManyToMany
    List<Shift> shifts;
}
