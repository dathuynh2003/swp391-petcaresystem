package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.service.petservice.PetServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("api/pet-service")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//@RequestMapping("/api/pet-service")
public class PetServiceController {
    @Autowired
    private PetServiceService petServiceService;

    @PostMapping
    public ResponseEntity<PetService> addPetSerVice(@RequestBody PetService service) {
        PetService newService = petServiceService.createPetService(service);
        return ResponseEntity.ok(newService);
    }
    @GetMapping
    public ResponseEntity<List<PetService>> getAllServices() {
        List<PetService> petServiceList = petServiceService.getAllPetServices();
        return ResponseEntity.ok(petServiceList);
    }
}
