package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.repository.PetServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceService implements IPetServiceService {
    @Autowired
    private PetServiceRepository petServiceRepository;

    @Override
    public List<PetService> getAllServies() {
        return petServiceRepository.findAll();
    }
}
