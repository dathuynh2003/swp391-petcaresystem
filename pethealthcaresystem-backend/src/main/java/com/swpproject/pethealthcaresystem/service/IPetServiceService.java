package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.PetService;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPetServiceService {

    public List<PetService> getAll();
    Page<PetService> getAllServices(Integer pageNo, Integer pageSize);
}
