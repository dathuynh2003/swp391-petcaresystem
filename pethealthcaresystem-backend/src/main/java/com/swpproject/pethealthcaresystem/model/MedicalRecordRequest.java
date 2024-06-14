package com.swpproject.pethealthcaresystem.model;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicalRecordRequest {
    MedicalRecord medicalRecord;
    Set<Prescription> listPrescriptions;
}
