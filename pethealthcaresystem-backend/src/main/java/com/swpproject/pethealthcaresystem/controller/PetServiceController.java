package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.service.PetServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PetServiceController {
    @Autowired
    private PetServiceService petServiceService;

    @GetMapping("/services")
    public List<PetService> getAllServices() {
        return petServiceService.getAllServies();
    }
}
