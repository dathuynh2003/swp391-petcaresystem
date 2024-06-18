package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Medicine;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IMedicineService {
    public Medicine addMedicine(Medicine medicine);
    public Medicine updateMedicine(int id, Medicine newMedicine);
    public String deleteMedicine(int id);
    public List<Medicine> getAllMedicine();
    public Page<Medicine> getMedicineByMedicineName(Integer pageNo, Integer pageSize, String name);
    public Page<Medicine> getExpiredMedicine(Integer pageNo, Integer pageSize);
    public Page<Medicine> getAllMedicinePagination(Integer pageNo, Integer pageSize);
    public List<Medicine> getMedicineByName(String name);
}
