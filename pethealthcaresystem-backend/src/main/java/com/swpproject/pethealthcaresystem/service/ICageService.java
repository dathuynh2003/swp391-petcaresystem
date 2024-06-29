package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Cage;
import com.swpproject.pethealthcaresystem.model.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICageService {
    public Cage createCage(Cage newCage, User staff) throws Exception;

    public Cage updateCage(int id, Cage newCage, User staff) throws IllegalArgumentException;

    public Page<Cage> findCageByName(int page, int size, String name) throws IllegalArgumentException;

    public Cage findCageById(int id) throws IllegalArgumentException;

    public List<Cage> findCageByTypeAndStatus(String type, String status) throws Exception;
}
