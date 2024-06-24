package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Cage;
import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.CageRepository;
import com.swpproject.pethealthcaresystem.repository.HospitalizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class CageService implements ICageService {
    @Autowired
    private CageRepository cageRepository;
    @Autowired
    private HospitalizationRepository hospitalizationRepository;


    @Override
    public Cage createCage(Cage newCage, User curUser) throws Exception {

        List<Cage> tempCage = cageRepository.findByNameContaining(newCage.getName());
        if (!tempCage.isEmpty()) {
            throw new Exception("Cage name already exists");
        }

        newCage.setUser(curUser);
        return cageRepository.save(newCage);
    }

    @Override
    public Cage updateCage(int id, Cage newCage, User curUser) throws IllegalArgumentException {
        if (newCage == null) {
            throw new IllegalArgumentException("New cage information cannot be null");
        }
        //newCage != null => Chắc chắn tempCage chỉ chứa 1 cage
        List<Cage> tempCage = cageRepository.findByNameContaining(newCage.getName());
        Cage oldCage = cageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cage not found"));

        //tempCage not empty + tempCageName != oldCageName => CageName đã tồn tại (ko cho trùng tên)
        if (!tempCage.isEmpty() && !tempCage.get(0).getName().equals(oldCage.getName())) {
            throw new IllegalArgumentException("Cage name already exists");
        }
        return cageRepository.findById(id)
                .map(cage -> {
                    cage.setName(newCage.getName());
                    cage.setPrice(newCage.getPrice());
                    cage.setStatus(newCage.getStatus());
                    cage.setDescription(newCage.getDescription());
                    cage.setSize(newCage.getSize());
                    cage.setType(newCage.getType());
                    cage.setUser(curUser);  //Staff nào update thì cập nhật Staff đó quản lí Cage luôn
                    return cageRepository.save(cage);
                }).orElseThrow(() -> new IllegalArgumentException("Cage not found with id:" + id));
    }

    @Override
    public Page<Cage> findCageByName(int page, int size, String cageName) throws IllegalArgumentException {
        Pageable pageable = PageRequest.of(page, size);
        if (cageName == null || cageName.isEmpty()) {
            return cageRepository.findAll(pageable);
        }

        return cageRepository.findByNameContaining(cageName, pageable);
    }

    @Override
    public Cage findCageById(int id) throws IllegalArgumentException {
        Cage cage = cageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cage not found with id:" + id));
        Set<Hospitalization> hospitalizations = hospitalizationRepository.findByCageOrderByIdDesc(cage);
        for (Hospitalization hospitalization : hospitalizations) {
            hospitalization.setCage(null);
        }
        cage.setHospitalizations(hospitalizations);
        return cage;
    }

    @Override
    public List<Cage> findCageByTypeAndStatus(String type, String status) throws Exception {
        if (type == null || type.isEmpty()) {
            throw new Exception("Cage type is empty. Cannot find");
        }

        if (status == null || status.isEmpty()) {
            throw new Exception("Cage type is empty. Cannot find");
        }


        return cageRepository.findByTypeAndStatus(type, status);
    }
}
