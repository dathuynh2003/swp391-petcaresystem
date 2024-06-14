package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    List<Medicine> findByNameContaining(String name);
}
