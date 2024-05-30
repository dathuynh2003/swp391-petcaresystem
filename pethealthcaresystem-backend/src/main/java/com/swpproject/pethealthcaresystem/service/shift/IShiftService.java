package com.swpproject.pethealthcaresystem.service.shift;

import com.swpproject.pethealthcaresystem.model.Shift;

import java.util.List;

public interface IShiftService {
    public Shift createShift(Shift shift);
    public Shift getShift(int shiftId);
    //public Shift updateShift(Shift shift);
    //public boolean deleteShift(int shiftId);
    public List<Shift> getAllShifts();
}
