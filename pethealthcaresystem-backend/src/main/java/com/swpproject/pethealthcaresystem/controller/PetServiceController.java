package com.swpproject.pethealthcaresystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.PetServiceService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")

public class PetServiceController {
    @Autowired
    private PetServiceService petServiceService;
    @Autowired
    private com.swpproject.pethealthcaresystem.service.PetService petService;

    @GetMapping("/allServices")
    public List<PetService> getAllServices() {
        return petServiceService.getAll();
    }

    @GetMapping("/services")
    public Page<PetService> getServicesPage(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize") Integer pageSize) {
        return petServiceService.getAllServices(pageNo, pageSize);
    }

    @PostMapping("/create-service")
    public Map<String, Object> createService(@RequestParam String serviceJson, @RequestParam MultipartFile file, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            // Dùng ObjectMapper Convert JSON string thành PetService object
            ObjectMapper objectMapper = new ObjectMapper();
            PetService service = objectMapper.readValue(serviceJson, PetService.class);
            response.put("service", petServiceService.createService(service, file));
            response.put("message", "successfully");
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/edit-service/{id}")
    public Map<String, Object> editService(@PathVariable Integer id, @RequestParam String serviceJson,
                                           @RequestParam(required = false) MultipartFile file, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            // Dùng ObjectMapper Convert JSON string thành PetService object
            ObjectMapper objectMapper = new ObjectMapper();
            PetService service = objectMapper.readValue(serviceJson, PetService.class);
            PetService petService;
            if (file == null) {
                petService = petServiceService.updateServiceWithoutImg(id, service);
            } else {
                petService = petServiceService.updateServiceWithImg(id, service, file);
            }
            response.put("message", "successfully");
            response.put("service", petService);
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/delete-service/{id}")
    public Map<String, Object> deleteService(@PathVariable Integer id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            response.put("service", petServiceService.deleteService(id));
            response.put("message", "successfully");
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }
}
