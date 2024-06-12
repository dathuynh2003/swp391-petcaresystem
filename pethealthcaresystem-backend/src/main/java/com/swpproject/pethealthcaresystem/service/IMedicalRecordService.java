package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.MedicalRecord;

import java.util.List;

public interface IMedicalRecordService {
    public List<MedicalRecord> getMedicalRecordByPetId(int petId);

}
