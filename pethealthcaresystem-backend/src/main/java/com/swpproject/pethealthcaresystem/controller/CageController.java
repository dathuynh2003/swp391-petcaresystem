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
public class CageController {
    @Autowired
    CageService cageService;

    @PostMapping("/createCage")
    public Map<String, Object> createCage(@RequestBody Cage newCage, HttpSession session) throws Exception {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser != null) {
                if (curUser.getRoleId() == 2 && newCage != null) {   //là Staff và newCage không null thì mới create được
                    newCage.setUser(curUser);
                    response.put("cage", cageService.createCage(newCage));
                    response.put("isSuccess", true);
                    return response;
                } else if (curUser.getRoleId() != 2) {
                    throw new Exception("You don't have permission to add a new cage");
                } else {
                    throw new Exception("New cage is null");
                }
            }
            throw new Exception("You need login first");
        } catch (Exception e) {
            response.put("isSuccess", false);
            response.put("message", e.getMessage());
            return response;
        }
    }

    @GetMapping("/cages")
    public Map<String, Object> getAllCages(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User curUser = (User) session.getAttribute("user");
        if (curUser != null) {
            try {
                List<Cage> cages = cageService.getAllCages();
                if (cages != null) {
                    response.put("cages", cages);
                    response.put("isSuccess", true);
                } else {
                    response.put("isSuccess", false);
                    response.put("message", "No cages found");
                }
            } catch (Exception e) {
                response.put("isSuccess", false);
                response.put("message", e.getMessage());
            }
        } else {
            response.put("isSuccess", false);
            response.put("message", "You need login first");
        }
        return response;
    }

    @PutMapping("/updateCage/{id}")
    public Map<String, Object> updateCage(@RequestBody Cage newCage, @PathVariable int id, HttpSession session) throws Exception {
        Map<String, Object> response = new HashMap<>();
        User curUser = (User) session.getAttribute("user");
        try {
            if (curUser != null) {
                if (curUser.getRoleId() == 2 && newCage != null) {
                    Cage cage = cageService.updateCage(id, newCage);
                    response.put("isSuccess", true);
                    response.put("cage", cage);
                } else if (curUser.getRoleId() != 2) {
                    throw new Exception("You don't have permission to add a new cage");
                } else {
                    throw new Exception("No have new info to update cage");
                }
            } else {
                throw new Exception("You need login first");
            }
        } catch (Exception e) {
            response.put("isSuccess", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}
