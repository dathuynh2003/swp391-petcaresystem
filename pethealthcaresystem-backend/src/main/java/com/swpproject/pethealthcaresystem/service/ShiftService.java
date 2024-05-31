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

    @Transactional
    @Override
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    @Transactional
    @Override
    public Shift createShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    @Transactional
    @Override
    public void deleteShift(int id) {
        shiftRepository.deleteById(id);
    }

    @Transactional
    @Override
    public List<VetShiftDetail> getAllShiftDetails() {
        return vetShiftDetailRepository.findAll();
    }

    @Transactional
    @Override
    public List<VetShiftDetail> assignVetToShifts(List<VetShiftDetail> vetShiftDetails) {
        return vetShiftDetails.stream()
                .map(vetShiftDetailRepository::save)
                .collect(Collectors.toList());
    }

}