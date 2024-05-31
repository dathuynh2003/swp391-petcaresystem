package com.swpproject.pethealthcaresystem.service.petservice;

import com.swpproject.pethealthcaresystem.model.PetService;

import java.util.List;

public interface IPetServiceService {
    public PetService createPetService(PetService petService);
    public List<PetService> getAllPetServices();
}
