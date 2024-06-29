package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.MedicalRecord;
import com.swpproject.pethealthcaresystem.model.Prescription;

import java.util.List;
import java.util.Set;

public interface IMedicalRecordService {
    public Set<MedicalRecord> getMedicalRecordByPetId(int petId);
    public MedicalRecord addMedicalRecord(MedicalRecord medicalRecord, int petId, Set<Prescription> listPrescriptions);
}
