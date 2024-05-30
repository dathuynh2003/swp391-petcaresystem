package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.service.petservice.PetServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//@RequestMapping("/api/pet-service")
public class PetServiceController {
    @Autowired
    private PetServiceService petServiceService;

    @PostMapping("/api/pet-service")
    public ResponseEntity<PetService> addPet(@RequestBody PetService service) {
        System.out.println("Printed:" + service);
        PetService newService = petServiceService.createPetService(service);
        return ResponseEntity.ok(newService);
    }
    @GetMapping("/api/pet-service")
    public ResponseEntity<List<PetService>> getAllPets() {
        List<PetService> petServiceList = petServiceService.getAllPetServices();
        return ResponseEntity.ok(petServiceList);
    }

}
