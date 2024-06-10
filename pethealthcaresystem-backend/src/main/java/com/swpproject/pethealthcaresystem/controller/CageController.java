package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Cage;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.CageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CageController {
    @Autowired
    private CageService cageService;

    @PostMapping("/createCage")
    public Map<String, Object> createCage(@RequestBody Cage newCage, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("message", "Cage created");
            response.put("cage", cageService.createCage(newCage, (User) session.getAttribute("user")));
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            response.put("cage", null);
        } catch (Exception e) {
            response.put("cage", null);
            response.put("message", "An unexpected error occurred");
        }
        return response;
    }

    @GetMapping("/cages")
    public Map<String, Object> getAllCages(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            List<Cage> cages = cageService.getAllCages(curUser);
            response.put("cages", cages);
            response.put("message", "Cages found");
        } catch (IllegalArgumentException e) {
            response.put("cages", null);
            response.put("message", e.getMessage());
        } catch (Exception e) {
            response.put("cages", null);
            response.put("message", "An unexpected error occurred");
        }
        return response;
    }

    @PutMapping("/updateCage/{id}")
    public Map<String, Object> updateCage(@RequestBody Cage newCage, @PathVariable int id, HttpSession session) throws Exception {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            Cage cage = cageService.updateCage(id, newCage, curUser);
            response.put("message", "Cage updated");
            response.put("cage", cage);
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            response.put("cage", null);
        } catch (Exception e) {
            response.put("message", "An unexpected error occurred");
            response.put("cage", null);
        }
        return response;
    }

    @GetMapping("/cage/search/{name}")
    public Map<String, Object> getCageByName(@PathVariable String name, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            response.put("message", "Cage found");
            response.put("cages", cageService.findCageByName(name, curUser));

        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            response.put("cage", null);
        } catch (Exception e) {
            response.put("message", "An unexpected error occurred");
            response.put("cage", null);
        }
        return response;
    }

    @GetMapping("/cage/search/")
    public Map<String, Object> getAllCageByName(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            String name = null;
            User curUser = (User) session.getAttribute("user");
            response.put("message", "Cage found");
            response.put("cages", cageService.findCageByName(name, curUser));

        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            response.put("cage", null);
        } catch (Exception e) {
            response.put("message", "An unexpected error occurred");
            response.put("cage", null);
        }
        return response;
    }

    @GetMapping("/cage/{id}")
    public Map<String, Object> getCageById(@PathVariable int id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User curUser = (User) session.getAttribute("user");
        try {
            if (curUser == null) {
                throw new IllegalArgumentException("You need to login first");
            }
            if (curUser.getRoleId() != 2) {
                throw new IllegalArgumentException("You don't have permission to do this");
            }
            response.put("cage", cageService.findCageById(id));
            response.put("message", "Cage found");
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            response.put("cage", null);
        } catch (Exception e) {
            response.put("message", "An unexpected error occurred");
            response.put("cage", null);
        }
        return response;
    }
}
