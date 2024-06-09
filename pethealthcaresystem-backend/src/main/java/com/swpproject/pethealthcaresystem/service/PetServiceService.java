package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.repository.PetServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceService implements IPetServiceService {
    @Autowired
    private PetServiceRepository petServiceRepository;

    @Override
    public List<PetService> getAll() {
        return petServiceRepository.findAll();
    }

    @Override
    public Page<PetService> getAllServices(Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return this.petServiceRepository.findAll(pageable);
    }

}
