package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.service.PetServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PetServiceController {
    @Autowired
    private PetServiceService petServiceService;

    @GetMapping("/allServices")
    public List<PetService> getAllServices() {
        return  petServiceService.getAll();
    }

    @GetMapping("/services")
    public Page<PetService> getServicesPage(@RequestParam(name =  "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize") Integer pageSize) {
        return petServiceService.getAllServices(pageNo, pageSize);
    }
}
