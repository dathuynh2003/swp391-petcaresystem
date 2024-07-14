package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.HospitalizationDetail;
import com.swpproject.pethealthcaresystem.model.Pet;

import java.util.List;
import java.util.Set;

public interface IHospitalizationService {
    public Hospitalization admitPet(int petId, int vetId, int cageId);

    public Hospitalization dischargePet(int hospitalizationId);

    public Hospitalization getHospitalizationById(int hospitalizationId);

    public Hospitalization updateAdmissionInfo(int hospId, Set<HospitalizationDetail> hospitalizationDetails) throws Exception;

    public Hospitalization updateAdmissionInfo(int hospId, String vetNote) throws Exception;

    public List<Hospitalization> getHospitalizationByPetIdAndStatus(int petId, String status) throws Exception;
}
