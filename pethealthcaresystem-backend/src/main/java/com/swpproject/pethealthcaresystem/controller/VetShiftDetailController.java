package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.service.vetshift.VetShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class VetShiftDetailController {
    @Autowired
    VetShiftService vetShiftService;

    @PostMapping("api/vetshift")
    public VetShiftDetail createVetShift(@RequestBody VetShiftDetail vetShiftDetail) {
         return vetShiftService.createVetShift(vetShiftDetail);
    }
    @GetMapping("api/vet-shifts")
    public List<VetShiftDetail> getAllVetShiftDetails() {
        return vetShiftService.getVetShifts();
    }
}
