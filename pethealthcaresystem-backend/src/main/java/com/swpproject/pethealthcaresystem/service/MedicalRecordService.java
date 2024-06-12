package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.MedicalRecord;
import com.swpproject.pethealthcaresystem.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService implements IMedicalRecordService {
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Override
    public List<MedicalRecord> getMedicalRecordByPetId(int petId) {
        return medicalRecordRepository.findAll().stream()
                .filter(medicalRecord -> medicalRecord.getPet().getPetId() == petId)
                .collect(Collectors.toList());
    }
}
