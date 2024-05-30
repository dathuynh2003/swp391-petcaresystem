package com.swpproject.pethealthcaresystem.service.shift;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftService implements IShiftService{
    @Autowired
    private ShiftRepository shiftRepository;

    @Override
    public Shift createShift(Shift shift) {
          return shiftRepository.save(shift);
    }

    @Override
    public Shift getShift(int shiftId) {
        return shiftRepository.findById(shiftId).get();
    }

    @Override
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }
}
