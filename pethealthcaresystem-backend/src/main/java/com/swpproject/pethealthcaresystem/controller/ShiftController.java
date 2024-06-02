package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.service.IShiftService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            if (shiftService.isShiftAssignedToVet(vetShiftDetail.getShift().getShiftId(), vetShiftDetail.getUser().getUserId(), vetShiftDetail.getDate())) {
                return ResponseEntity.badRequest().body("Shift is already assigned to the vet on the selected date.");
            }
        }
        shiftService.assignVetToShifts(vetShiftDetails);
        return ResponseEntity.ok("Shifts assigned successfully!");
    }

    @GetMapping("/vet-shift")
    List<VetShiftDetail> getAllVetShiftsByUser(HttpSession session){
        User curUser = (User) session.getAttribute("user");
        return shiftService.getAllVetShiftsByUser(curUser.getUserId());
    }
}
