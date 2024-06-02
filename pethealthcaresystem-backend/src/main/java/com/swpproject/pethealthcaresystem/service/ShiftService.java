// ShiftService.java
package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.repository.ShiftRepository;
import com.swpproject.pethealthcaresystem.repository.VetShiftDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShiftService implements IShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private VetShiftDetailRepository vetShiftDetailRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    @Override
    @Transactional
    public Shift createShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    @Override
    @Transactional
    public void deleteShift(int shiftId) {
        shiftRepository.deleteById(shiftId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VetShiftDetail> getAllShiftDetails() {
        return vetShiftDetailRepository.findAll();
    }

    @Override
    @Transactional
    public List<VetShiftDetail> assignVetToShifts(List<VetShiftDetail> vetShiftDetails) {
        return vetShiftDetailRepository.saveAll(vetShiftDetails);
    }

    @Override
    public List<VetShiftDetail> getAllVetShiftsByUser(int vetId) {
        return vetShiftDetailRepository.findAll().stream()
                .filter(vetShiftDetail -> vetShiftDetail.getUser() != null && vetShiftDetail.getUser().getUserId() == vetId)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isShiftAssignedToVet(int shiftId, int vetId, String date) {
        return vetShiftDetailRepository.existsByShiftShiftIdAndUserUserIdAndDate(shiftId, vetId, date);
    }
}
