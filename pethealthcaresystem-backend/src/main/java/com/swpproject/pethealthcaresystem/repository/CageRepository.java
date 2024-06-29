package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Cage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CageRepository extends JpaRepository<Cage, Integer> {
    List<Cage> findByNameContaining(String cageName);

    Page<Cage> findByNameContaining(String cageName, Pageable pageable);

    List<Cage> findByStatus(String status);

    List<Cage> findByTypeAndStatus(String type, String status);

    Cage findByIdAndStatus(int id, String status);
}
