package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.HospitalizationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HospitalizationController {
    @Autowired
    private HospitalizationService hospitalizationService;

    @PostMapping("/admit/pet/{petId}/vet/{vetId}")
    public Map<String, Object> admitPet(@PathVariable int petId, @PathVariable int vetId, HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        Map<String, Object> response = new HashMap<>();
        try {
            if (curUser == null) {
                throw new RuntimeException("You need to login first");
            }
            if (curUser.getRoleId() != 2 && curUser.getRoleId() != 3) {
                throw new RuntimeException("You don't have permission to do this");
            }
            Hospitalization hospitalization = hospitalizationService.admitPet(petId, vetId);
            response.put("message", "Admitted pet successfully");
            response.put("hospitalization", hospitalization);
        } catch (RuntimeException e) {
            response.put("message", e.getMessage());
            response.put("hospitalization", null);
        }
        return response;
    }

    @PutMapping("/discharged/{hospitalizationId}")
    public Map<String, Object> dischargePet(@PathVariable int hospitalizationId, HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        Map<String, Object> response = new HashMap<>();
        try {
            if (curUser == null) {
                throw new RuntimeException("You need to login first");
            }
            if (curUser.getRoleId() != 2 && curUser.getRoleId() != 3) {
                throw new RuntimeException("You don't have permission to do this");
            }
            Hospitalization hospitalization = hospitalizationService.dischargePet(hospitalizationId);
            response.put("message", "Discharged pet successfully");
            response.put("hospitalization", hospitalization);

        } catch (RuntimeException e) {
            response.put("message", e.getMessage());
            response.put("hospitalization", null);
        }
        return response;
    }
}
