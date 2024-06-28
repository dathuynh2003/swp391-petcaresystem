package com.swpproject.pethealthcaresystem.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.swpproject.pethealthcaresystem.model.PetService;
import com.swpproject.pethealthcaresystem.repository.PetServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class PetServiceService implements IPetServiceService {
    @Autowired
    private PetServiceRepository petServiceRepository;
    @Autowired
    private Cloudinary cloudinary;

    @Override
    public List<PetService> getAll() {
        return petServiceRepository.findAll();
    }

    @Override
    public Page<PetService> getAllServices(Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return this.petServiceRepository.findAllByIsActive(pageable, true);
    }

    @Override
    public PetService createService(PetService petService, MultipartFile file) throws Exception {
        if (petService == null) {
            throw new Exception("Service is null. Cannot create service");
        }
        validateFile(file);
        String imageUrl = uploadImageToCloudinary(file);
        petService.setImg(imageUrl);
        return petServiceRepository.save(petService);
    }

    @Override
    public PetService updateServiceWithoutImg(int id, PetService updatePetService) throws Exception {
        PetService oldPetService = petServiceRepository.findById(id).orElseThrow(() -> new Exception("Service not found. Cannot edit"));
        if (updatePetService == null) {
            throw new Exception("Update information is null. Cannot update service");
        }
        oldPetService.setNameService(updatePetService.getNameService());
        oldPetService.setPrice(updatePetService.getPrice());
        oldPetService.setDescription(updatePetService.getDescription());
        return petServiceRepository.save(oldPetService);
    }

    @Override
    public PetService updateServiceWithImg(int id, PetService updatePetService, MultipartFile file) throws Exception {
        PetService oldPetService = petServiceRepository.findById(id).orElseThrow(() -> new Exception("Service not found. Cannot edit"));
        if (updatePetService == null) {
            throw new Exception("Update information is null. Cannot update service");
        }

        validateFile(file);
        String imgUrl = uploadImageToCloudinary(file);

        oldPetService.setImg(imgUrl);
        oldPetService.setNameService(updatePetService.getNameService());
        oldPetService.setPrice(updatePetService.getPrice());
        oldPetService.setDescription(updatePetService.getDescription());

        return petServiceRepository.save(oldPetService);
    }

    @Override
    public PetService deleteService(int id) throws Exception {
        PetService petService = petServiceRepository.findById(id).orElseThrow(() -> new Exception("Service not found. Cannot edit"));
        petService.setIsActive(false);
        return petServiceRepository.save(petService);
    }


    private void validateFile(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new Exception("File is empty. Cannot create service");
        }
        //Check xem có phải file hình ảnh không
        if (!file.getContentType().startsWith("image/")) {
            throw new Exception("File is not an image. Cannot create service");
        }
    }

    private String uploadImageToCloudinary(MultipartFile file) throws Exception {
        try {
            //Upload lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            //Lấy URL về chuyển thành String để lưu vào DB
            return uploadResult.get("url").toString();
        } catch (Exception e) {
            throw new Exception("Failed to upload image to Cloudinary");
        }
    }

}
