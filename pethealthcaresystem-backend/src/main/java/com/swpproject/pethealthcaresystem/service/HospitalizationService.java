package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Cage;
import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.Pet;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.CageRepository;
import com.swpproject.pethealthcaresystem.repository.HospitalizationRepository;
import com.swpproject.pethealthcaresystem.repository.PetRepository;
import com.swpproject.pethealthcaresystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");


    @Override
    @Transactional
    public Hospitalization admitPet(int petId, int vetId) {
        Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        if (hospitalizationRepository.existsByPetAndStatus(pet, "admitted")) {
            throw new RuntimeException("Pet is already admitted in a cage");
        }
        User vet = userRepository.findById(vetId).orElseThrow(() -> new RuntimeException("Vet not found"));
        if (vet.getRoleId() != 3) throw new RuntimeException("Vet not found");
        List<Cage> availableCages = cageRepository.findByStatus("available");
        if (availableCages.isEmpty()) {
            throw new RuntimeException("No available cages");
        }

        Cage cage = availableCages.get(0);
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

        Cage cage = hospitalization.getCage();
        if (cage == null) {
            throw new RuntimeException("Cage not found");
        }
        cage.setStatus("available");
        cageRepository.save(cage);

        return hospitalizationRepository.save(hospitalization);
    }


}
