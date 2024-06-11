package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Hospitalization;

public interface IHospitalizationService {
    public Hospitalization admitPet(int petId, int vetId);
    public Hospitalization dischargePet(int hospitalizationId);
}
