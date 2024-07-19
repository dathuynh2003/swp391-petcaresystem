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
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")

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
    public Map<String, Object> searchMedicine(
            @PathVariable String name,
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize") Integer pageSize,
            HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();

        if (session.getAttribute("user") == null) {
           response.put("message", "You are not logged in");
           return response;
        }
        response.put("MEDICINES", medicineService.getMedicineByMedicineName(pageNo, pageSize, name));
        return response;

    }

    @GetMapping("/searchByName/{name}")
    public Map<String, Object> searchMedicine(@PathVariable String name, HttpSession session) {
        HashMap<String, Object> response = new HashMap<>();

        if (session.getAttribute("user") == null) {
            response.put("message", "You are not logged in");
            return response;
        }
        response.put("MEDICINES", medicineService.getMedicineByName(name));
        return response;

    }

    @GetMapping("/list")
    public ResponseEntity<?> getMedicineList(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize") Integer pageSize, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        return ResponseEntity.ok(medicineService.getAllMedicinePagination(pageNo, pageSize));
    }

    @GetMapping("/expired")
    public  ResponseEntity<?> getExpiredMedicine(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize")  Integer pageSize,HttpSession session) {
        if (session.getAttribute("user") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        return  ResponseEntity.ok(medicineService.getExpiredMedicine(pageNo, pageSize));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMedicine(@RequestBody Medicine medicine, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        return  ResponseEntity.ok(medicineService.addMedicine(medicine));
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editMedicine(@RequestBody Medicine newMedicine, @PathVariable int id,  HttpSession session) {
        if (session.getAttribute("user") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        return ResponseEntity.ok(medicineService.updateMedicine(id, newMedicine));
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable int id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        return ResponseEntity.ok(medicineService.deleteMedicine(id));
    }
}
