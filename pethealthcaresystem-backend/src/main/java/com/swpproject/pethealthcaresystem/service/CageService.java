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
    private CageRepository cageRepository;


    @Override
    public Cage createCage(Cage newCage, User curUser) throws IllegalArgumentException {
        if (curUser == null) {
            throw new IllegalArgumentException("You need to login first");
        }

        if (curUser.getRoleId() != 2) {
            throw new IllegalArgumentException("You don't have permission to do this");
        }

        if (newCage == null) {
            throw new IllegalArgumentException("New cage cannot be null");
        }

        newCage.setUser(curUser);
        return cageRepository.save(newCage);
    }

    @Override
    public List<Cage> getAllCages(User curUser) throws IllegalArgumentException {
        if (curUser == null) {
            throw new IllegalArgumentException("You need to login first");
        }
        if (curUser.getRoleId() != 2) {
            throw new IllegalArgumentException("You don't have permission to do this");
        }

        return cageRepository.findAll();
    }

    @Override
    public Cage updateCage(int id, Cage newCage, User curUser) throws IllegalArgumentException {

        if (curUser == null) {
            throw new IllegalArgumentException("You need to login first");
        }
        if (curUser.getRoleId() != 2) {
            throw new IllegalArgumentException("You don't have permission to do this");
        }
        if (newCage == null) {
            throw new IllegalArgumentException("New cage information cannot be null");
        }
        return cageRepository.findById(id)
                .map(cage -> {
                    cage.setUser(newCage.getUser());
                    cage.setStatus(newCage.getStatus());
                    cage.setDescription(newCage.getDescription());
                    return cageRepository.save(cage);
                }).orElseThrow(() -> new IllegalArgumentException("Cage not found with id:" + id));
    }

    @Override
    public List<Cage> findCageByName(String cageName, User curUser) throws IllegalArgumentException {
        if (curUser == null) {
            throw new IllegalArgumentException("You need to login first");
        }

        if (curUser.getRoleId() != 2) {
            throw new IllegalArgumentException("You don't have permission to do this");
        }

        if (cageName == null || cageName.isEmpty()) {
            return cageRepository.findAll();
        }

        return cageRepository.findByNameContaining(cageName);
    }
}
