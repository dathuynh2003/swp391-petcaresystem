package com.swpproject.pethealthcaresystem.service;


import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.PetRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PetService implements IPetService{
    @Autowired
    private PetRepository petRepository;

    @Override
    public Pet createPet(Pet newPet, User curUser) {

        newPet.setOwner(curUser);
        return petRepository.save(newPet);
    }
}
