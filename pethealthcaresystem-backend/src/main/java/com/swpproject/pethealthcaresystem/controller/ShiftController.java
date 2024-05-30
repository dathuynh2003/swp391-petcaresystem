package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.service.shift.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ShiftController {
    @Autowired
    private ShiftService shiftService;

    @PostMapping("/api/shift")
    public ResponseEntity<Shift> addShift(@RequestBody Shift shift) {
        Shift newShift = shiftService.createShift(shift);
        return ResponseEntity.ok(newShift);
    }

    @GetMapping("/api/shift/{id}")
    public ResponseEntity<Shift> getShift(@PathVariable("id") int id) {
        Shift shift = shiftService.getShift(id);
        return new ResponseEntity<Shift>(shift,HttpStatus.OK);
    }
    @GetMapping("api/shifts")
    public ResponseEntity<List<Shift>> getAllShifts() {
        List<Shift> shifts = shiftService.getAllShifts();
        return new ResponseEntity<>(shifts,HttpStatus.OK);
    }
}
