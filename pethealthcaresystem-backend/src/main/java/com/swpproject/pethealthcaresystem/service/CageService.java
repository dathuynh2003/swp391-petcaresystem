package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Cage;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.CageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CageService implements ICageService {
    @Autowired
    CageRepository cageRepository;


    @Override
    public Cage createCage(Cage newCage) {
        return cageRepository.save(newCage);
    }

    @Override
    public List<Cage> getAllCages() {
        return cageRepository.findAll();
    }

    @Override
    public Cage updateCage(int id, Cage newCage) {
        return cageRepository.findById(id)
                .map(cage -> {
                    cage.setUser(newCage.getUser());
                    cage.setStatus(newCage.getStatus());
                    cage.setDescription(newCage.getDescription());
                    return cageRepository.save(cage);
                }).orElseThrow(() -> new RuntimeException("Cage not found"));
    }

}
