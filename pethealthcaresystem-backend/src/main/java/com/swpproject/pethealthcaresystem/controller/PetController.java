package com.swpproject.pethealthcaresystem.controller;


import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.PetService;
import com.swpproject.pethealthcaresystem.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PetController {

    @Autowired
    private PetService petService;
    @Autowired
    private UserService userService;

    @PostMapping("/pet")
    String createPet(@RequestBody Pet newPet, HttpSession session){
        User curUser = (User) session.getAttribute("user");
        if (curUser != null){
            petService.createPet(newPet, curUser);
            return "Add new Pet successfully";
        }else{
            return "Please login first!";
        }

    }

    @PutMapping("/pet/{id}")
    Pet updatePet(@PathVariable int id, @RequestBody Pet newPet){
        return petService.updatePet(newPet, id);
    }

    @GetMapping("/pet/{id}")
    Pet getPet(@PathVariable int id){
        return petService.getPetById(id);
    }

    @GetMapping("/pet")
    List<Pet> getAllPets(){
        return petService.getAllPets();
    }

    @PutMapping("/deletePet/{id}")
    String deletePet(@PathVariable int id){
        return petService.deletePet(id);
    }
}
