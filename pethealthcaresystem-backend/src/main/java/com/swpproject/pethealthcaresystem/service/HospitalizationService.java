package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.*;
import com.swpproject.pethealthcaresystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Service
public class HospitalizationService implements IHospitalizationService {
    @Autowired
    private HospitalizationRepository hospitalizationRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CageRepository cageRepository;
    @Autowired
    private HospitalizationDetailRepository hospitalizationDetailRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");


    @Override
    @Transactional
    public Hospitalization admitPet(int petId, int vetId, int cageId) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        if (hospitalizationRepository.existsByPetAndStatus(pet, "admitted")) {
            throw new RuntimeException("Pet is already admitted in a cage");
        }
        User vet = userRepository.findById(vetId).orElseThrow(() -> new RuntimeException("Vet not found"));
        if (vet.getRoleId() != 3)
            throw new RuntimeException("Please assign a veterinarian to be responsible for the pet before admitting it to the cage.");
//        List<Cage> availableCages = cageRepository.findByStatus("available");
//        if (availableCages.isEmpty())
//            throw new RuntimeException("No available cages");
        Cage cage = cageRepository.findByIdAndStatus(cageId, "available");
        if (cage == null) throw new RuntimeException("Cage not found");
        cage.setStatus("occupied");
        cageRepository.save(cage);

        Hospitalization hospitalization = new Hospitalization();
        hospitalization.setPet(pet);
        hospitalization.setCage(cage);
        hospitalization.setUser(vet);
        hospitalization.setPrice(cage.getPrice());
        hospitalization.setStatus("admitted");

        LocalDateTime now = LocalDateTime.now();
        String admissionTime = now.format(formatter);
        hospitalization.setAdmissionTime(admissionTime);
        return hospitalizationRepository.save(hospitalization);
    }

    @Override
    @Transactional
    public Hospitalization dischargePet(int hospitalizationId) {
        Hospitalization hospitalization = hospitalizationRepository.findById(hospitalizationId)
                .orElseThrow(() -> new RuntimeException("Hospitalization not found"));
        if (hospitalization.getStatus().equals("discharged"))
            throw new RuntimeException("Pet has been discharged from the Clinic");
        LocalDateTime now = LocalDateTime.now();
        String dischargeTime = now.format(formatter);
        hospitalization.setDischargeTime(dischargeTime);
        hospitalization.setStatus("discharged");
//        hospitalization.setStatus("pending");

        Cage cage = hospitalization.getCage();
        if (cage == null) {
            throw new RuntimeException("Cage not found");
        }
        cage.setStatus("available");
        cageRepository.save(cage);

        return hospitalizationRepository.save(hospitalization);
    }

    @Override
    public Hospitalization getHospitalizationById(int id) {
        Hospitalization hospitalization = hospitalizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospitalization not found"));
        Set<HospitalizationDetail> hospDetails = hospitalizationDetailRepository.findByHospitalizationOrderByTimeAsc(hospitalization);
        hospitalization.setHospitalizationDetails(hospDetails);
        return hospitalization;
    }

    @Override
    public Hospitalization updateAdmissionInfo(int hospId, Set<HospitalizationDetail> hospitalizationDetails) throws Exception {
        Hospitalization hosp = hospitalizationRepository.findById(hospId).orElseThrow(() -> new Exception("Hospitalization not found"));
        if (hospitalizationDetails.isEmpty()) throw new Exception("Cannot find information to update");
        LocalDateTime now = LocalDateTime.now();
        String time = now.format(formatter);
        for (HospitalizationDetail hospDetail : hospitalizationDetails) {
            hospDetail.setTime(time);
            hospDetail.setHospitalization(hosp);
        }
        hospitalizationDetailRepository.saveAll(hospitalizationDetails);
        return hosp;
    }

    @Override
    public Hospitalization updateAdmissionInfo(int hospId, String vetNote) throws Exception {
        Hospitalization hosp = hospitalizationRepository.findById(hospId).orElseThrow(() -> new Exception("Hospitalization not found"));
        if (vetNote.isEmpty()) throw new Exception("Cannot find information to update");
        LocalDateTime now = LocalDateTime.now();
        String time = now.format(formatter);
        HospitalizationDetail hospDetail = new HospitalizationDetail();
        hospDetail.setTime(time);
        hospDetail.setHospitalization(hosp);
        hospDetail.setDescription(vetNote);
        hospitalizationDetailRepository.save(hospDetail);
        return hosp;
    }


}
