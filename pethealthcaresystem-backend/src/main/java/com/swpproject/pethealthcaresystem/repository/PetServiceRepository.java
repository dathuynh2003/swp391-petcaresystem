package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.PetService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetServiceRepository extends JpaRepository<PetService,Integer> {
    PetService findByName(String name);
}
