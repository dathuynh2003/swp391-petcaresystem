package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.PetService;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IPetServiceService {

    public List<PetService> getAll();
    Page<PetService> getAllServices(Integer pageNo, Integer pageSize);
    PetService createService(PetService petService, MultipartFile file) throws Exception;
    PetService updateServiceWithoutImg(int id, PetService petService) throws Exception;
    PetService updateServiceWithImg(int id, PetService petService, MultipartFile file) throws Exception;
    PetService deleteService(int id) throws Exception;
}
