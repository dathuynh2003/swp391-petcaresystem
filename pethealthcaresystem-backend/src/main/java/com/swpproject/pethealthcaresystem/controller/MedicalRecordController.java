package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.*;
import com.swpproject.pethealthcaresystem.service.MedicalRecordService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/medicalRecord")
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")

public class MedicalRecordController {
    @Autowired
    private MedicalRecordService medicalRecordService;
    @GetMapping("/getById/{petId}")
    public ResponseEntity<?> getMedicalRecordByPetId(@PathVariable(value = "petId") int petId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        else{
            return ResponseEntity.ok(medicalRecordService.getMedicalRecordByPetId(petId));
        }
    }

    @PostMapping("/add/{petId}")
    public Map<String, Object> addMedicalRecord(@RequestBody MedicalRecordRequest request, @PathVariable int petId, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();
        User user = (User) session.getAttribute("user");
        if (user == null) {
            response.put("message", "You are not logged in");
            return response;
        }
        MedicalRecord medicalRecord = request.getMedicalRecord();
        Set<Prescription> listPrescriptions = request.getListPrescriptions();
        medicalRecord.setUser(user);

        response.put("MedicalRecord",  medicalRecordService.addMedicalRecord(medicalRecord, petId, listPrescriptions));
        return response;

    }
}
