package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Cage;
import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface HospitalizationRepository extends JpaRepository<Hospitalization, Integer> {
    boolean existsByPetAndStatus(Pet pet, String status);
    Set<Hospitalization> findByPetOrderByIdDesc(Pet pet);
    Set<Hospitalization> findByCageOrderByIdDesc(Cage cage);

    List<Hospitalization> findByPetAndStatus(Pet pet, String status);
}
