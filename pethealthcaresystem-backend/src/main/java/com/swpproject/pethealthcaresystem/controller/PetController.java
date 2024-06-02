package com.swpproject.pethealthcaresystem.controller;


import com.swpproject.pethealthcaresystem.model.ApiResponse;
import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.PetService;
import com.swpproject.pethealthcaresystem.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
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
    ApiResponse<Pet> createPet(@Valid  @RequestBody Pet newPet, HttpSession session){
        User curUser = (User) session.getAttribute("user");
        ApiResponse<Pet> apiResponse = new ApiResponse<>();

        if (curUser != null) {
            // Nếu không có lỗi, tiếp tục xử lý
            apiResponse.setResult(petService.createPet(newPet, curUser));
        } else {
            apiResponse.setMessage("Please login first");
        }
        return apiResponse;

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
    List<Pet> getAllPets(HttpSession session){
        User curUser = (User) session.getAttribute("user");
        return petService.getAllPetsByUser(curUser.getUserId());
    }

    @PutMapping("/deletePet/{id}")
    String deletePet(@PathVariable int id){
        return petService.deletePet(id);
    }
}
