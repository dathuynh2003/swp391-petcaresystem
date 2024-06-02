package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Shift;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IShiftService {
    List<Shift> getAllShifts();
    Shift createShift(Shift shift);
    void deleteShift(int shiftId);
    List<VetShiftDetail> getAllShiftDetails();
    List<VetShiftDetail> assignVetToShifts(List<VetShiftDetail> vetShiftDetails);
    List<VetShiftDetail> getAllVetShiftsByUser(int vetId);
    boolean isShiftAssignedToVet(int shiftId, int userId, String date);
}
