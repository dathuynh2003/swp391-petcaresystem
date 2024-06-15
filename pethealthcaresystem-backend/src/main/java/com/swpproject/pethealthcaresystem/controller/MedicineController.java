package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.MedicalRecord;
import com.swpproject.pethealthcaresystem.model.Medicine;
import com.swpproject.pethealthcaresystem.service.MedicineService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/medicine")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MedicineController {
    @Autowired
    private MedicineService medicineService;
    @GetMapping("/all")
    public ResponseEntity<?> getAllMedicine(HttpSession session) {
        if (session.getAttribute("user") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        List<Medicine> listMedicine = medicineService.getAllMedicine();

        return ResponseEntity.ok(listMedicine);
    }

    @GetMapping("/search/{name}")
    public Map<String, Object> searchMedicine(@PathVariable String name, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();

        if (session.getAttribute("user") == null) {
           response.put("message", "You are not logged in");
           return response;
        }
        response.put("MEDICINES", medicineService.getMedicineByMedicineName(name));
        return response;

    }


}
