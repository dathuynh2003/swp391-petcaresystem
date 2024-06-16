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
    public Cage createCage(Cage newCage, User curUser) throws Exception {

        List<Cage> tempCage = cageRepository.findByNameContaining(newCage.getName());
        if (!tempCage.isEmpty()) {
            throw new Exception("Cage name already exists");
        }

        newCage.setUser(curUser);
        return cageRepository.save(newCage);
    }

    @Override
    public Cage updateCage(int id, Cage newCage, User curUser) throws IllegalArgumentException {

        if (curUser == null) {
            throw new IllegalArgumentException("You need to login first");
        }
//        Cage tempCage = cageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cage not found with id:" + id));
        if (curUser.getRoleId() != 2) {
            throw new IllegalArgumentException("You don't have permission to do this");
        }
        if (newCage == null) {
            throw new IllegalArgumentException("New cage information cannot be null");
        }
        List<Cage> tempCage = cageRepository.findByNameContaining(newCage.getName());
        Cage oldCage = cageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cage not found"));
        if (!tempCage.isEmpty() && !tempCage.get(0).getName().equals(oldCage.getName())) {
            throw new IllegalArgumentException("Cage name already exists");
        }
        return cageRepository.findById(id)
                .map(cage -> {
                    cage.setName(newCage.getName());
                    cage.setPrice(newCage.getPrice());
                    cage.setStatus(newCage.getStatus());
                    cage.setDescription(newCage.getDescription());
                    cage.setUser(curUser);
                    return cageRepository.save(cage);
                }).orElseThrow(() -> new IllegalArgumentException("Cage not found with id:" + id));
    }

    @Override
    public List<Cage> findCageByName(String cageName) throws IllegalArgumentException {

        if (cageName == null || cageName.isEmpty()) {
            return cageRepository.findAll();
        }

        return cageRepository.findByNameContaining(cageName);
    }

    @Override
    public Cage findCageById(int id) throws IllegalArgumentException {
        return cageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cage not found with id:" + id));
    }


}
