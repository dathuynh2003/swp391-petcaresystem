package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Medicine;
import com.swpproject.pethealthcaresystem.repository.MedicineRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService implements IMedicineService {
    @Autowired
    private MedicineRepository medicineRepository;

    @Override
    public Medicine addMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @Override
    public Medicine updateMedicine(int id, Medicine newMedicine) {
        Medicine medicine = medicineRepository.findById(id).get();
        if (medicine != null && newMedicine != null) {
            medicine.setName(newMedicine.getName());
            medicine.setDescription(newMedicine.getDescription());
            medicine.setPrice(newMedicine.getPrice());
            medicine.setMfgDate(newMedicine.getMfgDate());
            medicine.setExpDate(newMedicine.getExpDate());
            medicine.setQuantity(newMedicine.getQuantity());
            medicine.setType(newMedicine.getType());
            medicine.setUnit(newMedicine.getUnit());
            return medicineRepository.save(medicine);
        }
        throw new EntityNotFoundException("Medicine not found");

    }

    @Override
    public String deleteMedicine(int id) {
        Medicine medicine = medicineRepository.findById(id).get();
        if (medicine != null) {
            medicine.setStatus(false);
            medicineRepository.save(medicine);
            return "Medicine deleted successfully";
        }
        return "Medicine not found!";
    }

    @Override
    public List<Medicine> getAllMedicine() {
        return medicineRepository.findAll();
    }

    @Override
    public Page<Medicine> getMedicineByMedicineName(Integer pageNo, Integer pageSize, String name) {
        LocalDate today = LocalDate.now();
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return medicineRepository.findByExpDateAfterAndNameContainingAndStatus(today, name, true, pageable);
    }

    @Override
    public Page<Medicine> getExpiredMedicine(Integer pageNo, Integer pageSize) {
        LocalDate currentDate = LocalDate.now();
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return medicineRepository.findByExpDateBefore(currentDate, pageable);
    }

    @Override
    public Page<Medicine> getAllMedicinePagination(Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return medicineRepository.findByStatus(pageable, true);
    }

    @Override
    public List<Medicine> getMedicineByName(String name) {
        return medicineRepository.findByNameContainingAndStatus(name, true);
    }
}
