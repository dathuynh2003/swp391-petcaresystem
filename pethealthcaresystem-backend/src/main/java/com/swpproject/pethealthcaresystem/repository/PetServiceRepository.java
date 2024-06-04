package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.PetService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetServiceRepository extends JpaRepository<PetService, Integer> {
}
