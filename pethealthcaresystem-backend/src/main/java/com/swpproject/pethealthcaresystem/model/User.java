package com.swpproject.pethealthcaresystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user",schema = "pethealthcare")
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
    private Boolean isActive;
    private Date dob;

}
