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
//    VetShiftDetail assignVetToShift(VetShiftDetail vetShiftDetail);
    List<VetShiftDetail> assignVetToShifts(List<VetShiftDetail> vetShiftDetails);
}
