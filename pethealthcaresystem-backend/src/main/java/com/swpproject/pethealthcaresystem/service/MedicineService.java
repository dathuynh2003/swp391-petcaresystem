package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Medicine;
import com.swpproject.pethealthcaresystem.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class MedicineService implements IMedicineService {
    @Autowired
    private MedicineRepository medicineRepository;
    @Override
    public List<Medicine> getAllMedicine() {
        return medicineRepository.findAll();
    }

    @Override
    public List<Medicine> getMedicineByMedicineName(String name) {
        return medicineRepository.findByNameContaining(name);
    }
}
