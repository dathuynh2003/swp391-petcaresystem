package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IPetService {
    Pet createPet(Pet newPet, User curUser);

    Pet updatePet(Pet newPet, int id);

    Pet getPetById(int id);

    List<Pet> getAllPets();

    String deletePet(int id);

    List<Pet> getAllPetsByUser(int ownerId);

    List<Pet> getPetsByOwnerPhoneNumber(String phoneNumber);

    Pet createPetForAnonymousUser(Pet newPet, String phoneNumber);

    Pet updatePetAvatar(int id, MultipartFile file) throws IOException;
}