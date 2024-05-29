package com.swpproject.pethealthcaresystem.controller;


import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.PetService;
import com.swpproject.pethealthcaresystem.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PetController {

    @Autowired
    private PetService petService;

    @PostMapping("/pet")
    String createPet(@RequestBody Pet newPet, HttpSession session){
        User curUser = (User) session.getAttribute("user");
        if (curUser != null){
            petService.createPet(newPet, curUser);
            return "";
        }else{
            return "Please login first!";
        }

    }
}
