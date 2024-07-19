package com.swpproject.pethealthcaresystem.service;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.swpproject.pethealthcaresystem.model.*;
import com.swpproject.pethealthcaresystem.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PetService implements IPetService {
    public static final String AVARTAR_PET_DEFAULT = "https://res.cloudinary.com/dinklulzk/image/upload/v1719295004/logoPetCare_lktjfl.png";

    @Autowired
    private PetRepository petRepository;
    @Autowired
    private HospitalizationRepository hospitalizationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HospitalizationDetailRepository hospitalizationDetailRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Pet createPet(Pet newPet, User curUser) {

        newPet.setOwner(curUser);
        newPet.setIsDeceased(false);
        newPet.setAvatar(AVARTAR_PET_DEFAULT);
        return petRepository.save(newPet);
    }

    @Override
    public Pet updatePet(Pet newPet, int id) {
        return petRepository.findById(id)
                .map(pet -> {
                    pet.setName(newPet.getName());
                    pet.setPetType(newPet.getPetType());
                    pet.setAvatar(newPet.getAvatar());
//                    pet.setAge(newPet.getAge());
                    pet.setDob(newPet.getDob());
                    pet.setGender(newPet.getGender());
                    pet.setBreed(newPet.getBreed());
                    pet.setIsDeceased(newPet.getIsDeceased());
                    pet.setDescription(newPet.getDescription());
                    pet.setIsNeutered(newPet.getIsNeutered());
                    return petRepository.save(pet);
                }).orElseThrow(() -> new RuntimeException("Pet not found"));

    }

    @Override
    public Pet getPetById(int id) {
        Pet pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));
        Set<Booking> bookings = bookingRepository.findBookingsByPet(pet);
        Set<Hospitalization> hospitalizationSet = hospitalizationRepository.findByPetOrderByIdDesc(pet);
        for (Hospitalization hospitalization : hospitalizationSet) {
            Set<HospitalizationDetail> hospDetails = hospitalizationDetailRepository
                    .findByHospitalizationOrderByTimeAsc(hospitalization);
            for (HospitalizationDetail hospDetail : hospDetails) {
                hospDetail.setHospitalization(null);
            }
            hospitalization.setHospitalizationDetails(hospDetails);
            // Chống lặp lại vô hạn
            hospitalization.getUser().setVetShiftDetails(null);
        }
        pet.setHospitalizations(hospitalizationSet);
//        Chống vòng lặp vô hạn, pet có booking, booking lại có pet. tương tự user và các object khác
        for (Booking booking : bookings) {
            booking.setPet(null);
            booking.setUser(null);
            booking.setBookingDetails(null);
            booking.setVetShiftDetail(null);
        }
        pet.setBookings(bookings);
        return pet;
    }

    @Override
    public List<Pet> getAllPets() {
        return petRepository.findAll().stream()
                .filter(pet -> !pet.getIsDeceased())
                .collect(Collectors.toList());
    }


    @Override
    public String deletePet(int id) {
        Pet pet = getPetById(id);
        pet.setIsDeceased(true);

        petRepository.save(pet);
        return "Delete pet successfully";
    }

    @Override
    public List<Pet> getAllPetsByUser(int ownerId) {
        try {
            List<Pet> pets = petRepository.findAll().stream()
                    .filter(pet -> !pet.getIsDeceased())
                    .filter(pet -> pet.getOwner() != null && pet.getOwner().getUserId() == ownerId)
                    .collect(Collectors.toList());
            return pets;
        } catch (StackOverflowError e) {
            System.out.println("------------------------- error --------------------------");
            System.out.println(e.toString());
            return new ArrayList<>();
        }

    }

    @Override
    public List<Pet> getPetsByOwnerPhoneNumber(String phoneNumber) {
        return petRepository.findAll().stream()
                .filter(pet -> pet.getOwner() != null && phoneNumber.equals(pet.getOwner().getPhoneNumber()))
                .collect(Collectors.toList());
    }

    @Override
    public Pet createPetForAnonymousUser(Pet newPet, String phoneNumber) {
        User anonymousUser = userService.createOrGetAnonymousUser(phoneNumber, newPet.getOwner().getFullName());

        newPet.setOwner(anonymousUser);
        newPet.setIsDeceased(false);
        newPet.setAvatar(AVARTAR_PET_DEFAULT);
        return petRepository.save(newPet);
    }

    @Transactional
    @Override
    public Pet updatePetAvatar(int id, MultipartFile file) throws IOException {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet not found with id: " + id));

        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Check file type
        String contentType = file.getContentType();
        if (!contentType.startsWith("image/")) {
            throw new IOException("Invalid file type. Only image files are allowed.");
        }

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = uploadResult.get("url").toString();

        // Update pet's avatar
        pet.setAvatar(imageUrl);

        // Save updated pet
        return petRepository.save(pet);
    }
}