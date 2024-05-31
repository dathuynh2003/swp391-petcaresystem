package com.swpproject.pethealthcaresystem.service.petservice;

import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.repository.PetServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceService implements IPetServiceService {

    @Autowired
    PetServiceRepository petServiceRepository;

    @Override
    public PetService createPetService(PetService newPetService) {
        return petServiceRepository.save(newPetService);
    }

    @Override
    public List<PetService> getAllPetServices() {
        return petServiceRepository.findAll();
    }
}
