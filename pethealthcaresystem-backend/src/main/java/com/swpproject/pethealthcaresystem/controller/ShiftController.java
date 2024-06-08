package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.service.IShiftService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/shifts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ShiftController {

    @Autowired
    private IShiftService shiftService;

    @GetMapping("/all")
    public List<Shift> getAllShifts() {
        return shiftService.getAllShifts();
    }

    @PostMapping("/add")
    public Shift addShift(@RequestBody Shift shift) {
        return shiftService.createShift(shift);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable(value = "id") int shiftId) {
        shiftService.deleteShift(shiftId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/details")
    public List<VetShiftDetail> getAllShiftDetails() {
        return shiftService.getAllShiftDetails();
    }

    @PutMapping("/assign-vet")
    public ResponseEntity<String> assignVetToShifts(@RequestBody List<VetShiftDetail> vetShiftDetails) {
        for (VetShiftDetail vetShiftDetail : vetShiftDetails) {
            if (shiftService.isShiftAssignedToVet(vetShiftDetail.getShift().getShiftId(), vetShiftDetail.getUser().getUserId(), vetShiftDetail.getDate().toString())) {
                return ResponseEntity.badRequest().body("Shift is already assigned to the vet on the selected date.");
            }
        }
        shiftService.assignVetToShifts(vetShiftDetails);
        return ResponseEntity.ok("Shifts assigned successfully!");
    }

    @GetMapping("/vet-shift")
    public List<VetShiftDetail> getAllVetShiftsByUser(HttpSession session){
        User curUser = (User) session.getAttribute("user");
        return shiftService.getAllVetShiftsByUser(curUser.getUserId());
    }

    @DeleteMapping("/delete-vet-shift")
    public ResponseEntity<?> deleteVetShiftDetail(
            @RequestParam Long shiftId,
            @RequestParam Long vetId,
            @RequestParam String date) {
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
