package com.swpproject.pethealthcaresystem.service.vetshift;

import com.swpproject.pethealthcaresystem.model.VetShiftDetail;

import java.util.List;

public interface IVetShiftService {
    public VetShiftDetail createVetShift(VetShiftDetail vetShiftDetail);
    public List<VetShiftDetail> getVetShifts();
    public VetShiftDetail updateVetShift(VetShiftDetail vetShiftDetail);
    public boolean deleteVetShift(int vetShiftId);
}
