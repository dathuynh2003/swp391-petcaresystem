package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.MedicalRecord;
import com.swpproject.pethealthcaresystem.model.Medicine;
import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.Prescription;
import com.swpproject.pethealthcaresystem.repository.MedicalRecordRepository;
import com.swpproject.pethealthcaresystem.repository.MedicineRepository;
import com.swpproject.pethealthcaresystem.repository.PetRepository;
import com.swpproject.pethealthcaresystem.repository.PrescriptionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ssl.SslAutoConfiguration;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService implements IMedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private SslAutoConfiguration sslAutoConfiguration;

    @Override
    public Set<MedicalRecord> getMedicalRecordByPetId(int petId) {
       Set<MedicalRecord> medicalRecords = new HashSet<>();
        Pet pet = petRepository.findById(petId).get();
        medicalRecords =  medicalRecordRepository.findAll().stream()
                .filter(medicalRecord -> medicalRecord.getPet().getPetId() == petId)
                .collect(Collectors.toSet());
        pet.setMedicalRecords(medicalRecords);
        for (MedicalRecord medicalRecord : medicalRecords) {
            medicalRecord.getUser().setVetShiftDetails(null);
        }
        return  medicalRecords;
    }

    @Override
//    @Transactional
    public MedicalRecord addMedicalRecord(MedicalRecord medicalRecord, int petId, Set<Prescription> listPrescriptions) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        medicalRecord.setPet(pet);
        medicalRecord.setDate(new Date());
        medicalRecord.setPrescriptions(listPrescriptions);
        double total = 0;
        for (Prescription prescription : medicalRecord.getPrescriptions()) {
            Medicine medicine = medicineRepository.findById(prescription.getMedicine().getId()).get();
            medicine.setQuantity(medicine.getQuantity() - prescription.getDosage());
            if (medicine.getQuantity() < 0) {
                return null;
            }
            total += prescription.getDosage() * prescription.getPrice();
        }
        medicalRecord.setTotalAmount(total);
        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);

        for (Prescription prescription : listPrescriptions) {
            prescription.setMedicalRecord(savedRecord);
            prescriptionRepository.save(prescription);
        }
        savedRecord.setPrescriptions(listPrescriptions);
        Set<MedicalRecord> petMedicalRecords = pet.getMedicalRecords();
        petMedicalRecords.add(savedRecord);
        pet.setMedicalRecords(petMedicalRecords);
        return savedRecord;

    }
}
