package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Integer> {
}
