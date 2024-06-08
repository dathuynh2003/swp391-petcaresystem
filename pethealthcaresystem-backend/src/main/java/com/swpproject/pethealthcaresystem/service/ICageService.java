package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Cage;
import org.apache.catalina.User;

import java.util.List;

public interface ICageService {
    public Cage createCage(Cage newCage);
    public List<Cage> getAllCages();
    public Cage updateCage(int id, Cage newCage);
}
