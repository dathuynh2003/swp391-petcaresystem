package com.swpproject.pethealthcaresystem.controller;


import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.PetService;
import com.swpproject.pethealthcaresystem.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    String createPet(@RequestBody Pet newPet, HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser != null) {
            petService.createPet(newPet, curUser);
            return "Add new Pet successfully";
        } else {
            return "Please login first!";
        }

    }

    @PutMapping("/pet/{id}")
    Pet updatePet(@PathVariable int id, @RequestBody Pet newPet) {
        return petService.updatePet(newPet, id);
    }

    @GetMapping("/pet/{id}")
    Pet getPet(@PathVariable int id) {
        return petService.getPetById(id);
    }

    @GetMapping("/pet")
    List<Pet> getAllPets(HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        List<Pet> pets = petService.getAllPetsByUser(curUser.getUserId());
//        System.out.println("-----------------------------------------------------------------------------------");
//        System.out.println(pets.toString());
        return pets;
    }
    @GetMapping("/pets")
    List<Pet> getAllPets(){
        return petService.getAllPets();
    }
    @PutMapping("/deletePet/{id}")
    String deletePet(@PathVariable int id) {
        return petService.deletePet(id);
    }

    @GetMapping("/pets/ownerPhone/{phoneNumber}")
    public List<Pet> getPetsByOwnerPhoneNumber(@PathVariable String phoneNumber){
        return petService.getPetsByOwnerPhoneNumber(phoneNumber);
    }

    @PostMapping("/createForAnonymous")
    public ResponseEntity<Pet> createPetForAnonymousUser(@RequestBody Pet newPet, HttpSession session) throws Exception {
        User curUser = (User) session.getAttribute("user");
        if (curUser != null) {
            try {
                System.out.println("Received newPet: " + newPet);
                Pet pet = petService.createPetForAnonymousUser(newPet, newPet.getOwner().getPhoneNumber());
                return ResponseEntity.ok(pet);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        throw new Exception("You need login first");
    }
}
