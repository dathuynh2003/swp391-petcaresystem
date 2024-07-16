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
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")


public class CageController {
    @Autowired
    private CageService cageService;

    @PostMapping("/createCage")
    public Map<String, Object> createCage(@RequestBody Cage newCage, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            if (curUser.getRoleId() != 2) {
                throw new Exception("You don't have permission to do this");
            }
            if (newCage == null) {
                throw new Exception("New cage cannot be null");
            }
            response.put("message", "Cage created");
            response.put("cage", cageService.createCage(newCage, curUser));
        } catch (Exception e) {
            response.put("cage", null);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/updateCage/{id}")
    public Map<String, Object> updateCage(@RequestBody Cage newCage, @PathVariable int id, HttpSession session) throws Exception {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new IllegalArgumentException("You need to login first");
            }
            if (curUser.getRoleId() != 2) {
                throw new IllegalArgumentException("You don't have permission to do this");
            }
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
    public Map<String, Object> getCageByName(@PathVariable String name,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "5") int size,
                                             HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new IllegalArgumentException("You need to login first");
            }
            if (curUser.getRoleId() != 2) {
                throw new IllegalArgumentException("You don't have permission to do this");
            }

            response.put("message", "Cage found");
            response.put("cages", cageService.findCageByName(page, size, name));

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
    public Map<String, Object> getAllCageByName(HttpSession session,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "5") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            String name = null;
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new IllegalArgumentException("You need to login first");
            }
            if (curUser.getRoleId() != 2) {
                throw new IllegalArgumentException("You don't have permission to do this");
            }
            response.put("message", "Cage found");
            response.put("cages", cageService.findCageByName(page, size, name));

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

    @GetMapping("/cages/{type}")
    public Map<String, Object> getCageByType(@PathVariable String type, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User curUser = (User) session.getAttribute("user");
        try {
            if (curUser == null) {
                throw new IllegalArgumentException("You need to login first");
            }
            List<Cage> cages = cageService.findCageByTypeAndStatus(type, "available");
            if (cages.isEmpty()) {
                response.put("message", "There are no more available cages");
                return response;
            }
            response.put("cages", cageService.findCageByTypeAndStatus(type, "available"));
            response.put("message", "Cage found");
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            response.put("cages", null);
        } catch (Exception e) {
            response.put("message", "An unexpected error occurred");
            response.put("cages", null);
        }
        return response;
    }
}
