//ShiftController.java
package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.service.ShiftService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shifts")
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")

public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllShifts(HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first!");
        }
        List<Shift> shifts = shiftService.getAllShifts();
        return ResponseEntity.ok(shifts);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addShift(@RequestBody Shift shift, HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first!");
        }
        Shift createdShift = shiftService.createShift(shift);
        return ResponseEntity.ok(createdShift);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteShift(@PathVariable(value = "id") int shiftId, HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first!");
        }
        shiftService.deleteShift(shiftId);
        return ResponseEntity.ok("Shift deleted successfully");
    }

    @GetMapping("/details")
    public ResponseEntity<?> getAllShiftDetails(HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first!");
        }
        List<VetShiftDetail> shiftDetails = shiftService.getAllShiftDetails();
        return ResponseEntity.ok(shiftDetails);
    }

    @PutMapping("/assign-vet")
    public ResponseEntity<?> assignVetToShifts(@RequestBody List<VetShiftDetail> vetShiftDetails, HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first!");
        }
        for (VetShiftDetail vetShiftDetail : vetShiftDetails) {
            if (shiftService.isShiftAssignedToVet(vetShiftDetail.getShift().getShiftId(), vetShiftDetail.getUser().getUserId(), vetShiftDetail.getDate())) {
                return ResponseEntity.badRequest().body("Shift is already assigned to the vet on the selected date.");
            }
        }
        shiftService.assignVetToShifts(vetShiftDetails);
        return ResponseEntity.ok("Shifts assigned successfully!");
    }

    @GetMapping("/vet-shift")
    public ResponseEntity<?> getAllVetShiftsByUser(HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first!");
        }
        List<VetShiftDetail> vetShifts = shiftService.getAllVetShiftsByUser(curUser.getUserId());
        return ResponseEntity.ok(vetShifts);
    }

    @DeleteMapping("/delete-vet-shift")
    public ResponseEntity<?> deleteVetShiftDetail(
            @RequestParam Long shiftId,
            @RequestParam Long vetId,
            @RequestParam String date,
            HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        if (curUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first!");
        }
        try {
            boolean deleted = shiftService.deleteVetShiftDetail(shiftId, vetId, date);
            if (deleted) {
                return ResponseEntity.ok("Shift detail deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Shift detail not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting shift detail.");
        }
    }
    @GetMapping("/availableShift")
    public List<VetShiftDetail> getAllAvailableShifts() {
        return shiftService.getAvailableVetShiftDetails();
    }
    @GetMapping("shiftByDate/{date}")
    public List<VetShiftDetail> getAllShiftsByDate(@PathVariable(value = "date") String date) {
        return  shiftService.getShiftByDate(date);
    }
}
