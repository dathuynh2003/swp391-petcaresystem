package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.service.IShiftService;
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
    public List<VetShiftDetail> assignVetToShifts(@RequestBody List<VetShiftDetail> vetShiftDetails) {
        return shiftService.assignVetToShifts(vetShiftDetails);
    }
}
