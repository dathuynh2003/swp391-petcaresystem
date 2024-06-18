package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    List<Medicine> findByNameContainingAndStatus(String name, boolean status);
    Page<Medicine> findByExpDateBefore(LocalDate currentDate, Pageable pageable);
    Page<Medicine> findByExpDateAfterAndNameContainingAndStatus(LocalDate today, String name, boolean status, Pageable pageable);

    Page<Medicine> findByStatus(Pageable pageable, boolean status);

}
