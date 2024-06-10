package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Cage;
import com.swpproject.pethealthcaresystem.model.User;

import java.util.List;

public interface ICageService {
    public Cage createCage(Cage newCage, User staff) throws IllegalArgumentException;

    public List<Cage> getAllCages(User staff) throws IllegalArgumentException;

    public Cage updateCage(int id, Cage newCage, User staff) throws IllegalArgumentException;

    public List<Cage> findCageByName(String cageName, User staff) throws IllegalArgumentException;
}
