package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;

import java.util.List;

public interface IPetService {
    Pet createPet(Pet newPet, User curUser);

    Pet updatePet(Pet newPet, int id);
    Pet getPetById(int id);
    List<Pet> getAllPets();
    String deletePet(int id);
}