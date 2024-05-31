package com.swpproject.pethealthcaresystem.service;


import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.PetRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetService implements IPetService{
    @Autowired
    private PetRepository petRepository;

    @Override
    public Pet createPet(Pet newPet, User curUser) {

        newPet.setOwner(curUser);
        return petRepository.save(newPet);
    }

    @Override
    public Pet updatePet(Pet newPet, int id) {
        return petRepository.findById(id)
                .map(pet -> {
                    pet.setName(newPet.getName());
                    pet.setPetType(newPet.getPetType());
                    pet.setAvatar(newPet.getAvatar());
                    pet.setAge(newPet.getAge());
                    pet.setGender(newPet.getGender());
                    pet.setBreed(newPet.getBreed());
                    pet.setDeceased(newPet.isDeceased());
                    pet.setDescription(newPet.getDescription());
                    pet.setNeutered(newPet.isNeutered());
                    return petRepository.save(pet);
                }).orElseThrow(() ->  new RuntimeException("Pet not found"));

    }

    @Override
    public Pet getPetById(int id) {
        return petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));
    }

    @Override
    public List<Pet> getAllPets() {

        return petRepository.findAll().stream()
                .filter(pet -> !pet.isDeceased())
                .collect(Collectors.toList());
    }

    @Override
    public String deletePet(int id) {
        Pet pet = getPetById(id);
        pet.setDeceased(true);
        petRepository.save(pet);
        return "Delete pet successfully";
    }
}
