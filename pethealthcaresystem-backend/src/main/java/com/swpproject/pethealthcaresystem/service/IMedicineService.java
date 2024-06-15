package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Medicine;

import java.util.List;

public interface IMedicineService {
    public List<Medicine> getAllMedicine();
    public List<Medicine> getMedicineByMedicineName(String name);
}
