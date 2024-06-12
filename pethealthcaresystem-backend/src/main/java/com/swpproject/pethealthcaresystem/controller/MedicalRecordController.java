package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.MedicalRecord;
import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.MedicalRecordService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MedicalRecordController {
    @Autowired
    private MedicalRecordService medicalRecordService;
    @GetMapping("/medicalRecord/{petId}")
    public ResponseEntity<?> getMedicalRecordByPetId(@PathVariable(value = "petId") int petId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        else{
            return ResponseEntity.ok(medicalRecordService.getMedicalRecordByPetId(petId));
        }
    }
}
