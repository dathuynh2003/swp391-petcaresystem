package com.swpproject.pethealthcaresystem.service.vetshift;

import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.repository.VetShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class VetShiftService implements IVetShiftService {
    @Autowired
    private VetShiftRepository vetShiftRepository;

    @Override
    public VetShiftDetail createVetShift(VetShiftDetail vetShiftDetail) {
        return vetShiftRepository.save(vetShiftDetail);
    }

    @Override
    public List<VetShiftDetail> getVetShifts() {
        return vetShiftRepository.findAll();
    }

    @Override
    public VetShiftDetail updateVetShift(VetShiftDetail vetShiftDetail) {
        VetShiftDetail existingVSD = vetShiftRepository.findById(vetShiftDetail.getVsId()).get();
        if (existingVSD == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, null);
        }
        existingVSD.setVsId(vetShiftDetail.getVsId());
        existingVSD.setShift(vetShiftDetail.getShift());
        existingVSD.setUser(vetShiftDetail.getUser());
        existingVSD.setDate(vetShiftDetail.getDate());
        return vetShiftRepository.save(existingVSD);
    }

    @Override
    public boolean deleteVetShift(int vetShiftId) {
        return false;
    }
}
