package com.swpproject.pethealthcaresystem.service;


import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.HospitalizationRepository;
import com.swpproject.pethealthcaresystem.repository.PetRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PetService implements IPetService{
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private HospitalizationRepository hospitalizationRepository;

    @Override
    public Pet createPet(Pet newPet, User curUser) {

        newPet.setOwner(curUser);
        newPet.setIsDeceased(false);
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
                    pet.setIsDeceased(newPet.getIsDeceased());
                    pet.setDescription(newPet.getDescription());
                    pet.setIsNeutered(newPet.getIsNeutered());
                    return petRepository.save(pet);
                }).orElseThrow(() ->  new RuntimeException("Pet not found"));

    }

    @Override
    public Pet getPetById(int id) {
        Pet pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));
        Set<Hospitalization> hospitalizationSet = hospitalizationRepository.findByPet(pet);
        pet.setHospitalizations(hospitalizationSet);
        return pet;
    }

    @Override
    public List<Pet> getAllPets() {

        return petRepository.findAll().stream()
                .filter(pet -> !pet.getIsDeceased())
                .collect(Collectors.toList());
    }

    @Override
    public String deletePet(int id) {
        Pet pet = getPetById(id);
        pet.setIsDeceased(true);
        petRepository.save(pet);
        return "Delete pet successfully";
    }

    @Override
    public List<Pet> getAllPetsByUser(int ownerId) {
        return petRepository.findAll().stream()
                .filter(pet -> !pet.getIsDeceased())
                .filter(pet -> pet.getOwner() != null && pet.getOwner().getUserId() == ownerId)
                .collect(Collectors.toList());
    }
}
