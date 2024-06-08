package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Cage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CageRepository extends JpaRepository<Cage, Integer> {
}
