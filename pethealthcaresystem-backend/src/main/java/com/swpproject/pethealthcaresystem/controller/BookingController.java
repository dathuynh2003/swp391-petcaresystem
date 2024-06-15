package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.BookingDetail;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.service.BookingService;
import com.swpproject.pethealthcaresystem.service.PetService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping("/createBooking/pet/{petId}/vet-shift/{vsId}/services/{serviceIds}")
    public Booking createBooking(@RequestBody Booking booking, @PathVariable int petId, @PathVariable int vsId, @PathVariable List<Integer> serviceIds, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return null;
            }
            return bookingService.createBooking(booking, user, petId, vsId, serviceIds);


        } catch (RuntimeException e) {
            return null;
        }
    }

    @PutMapping("/update-booking")
    public ResponseEntity<ResponseData> updateBooking(@RequestBody Booking booking) {
        try{
            ResponseData<Booking> responseData = new ResponseData<>();
            Booking updatedBooking = bookingService.updateBoking(booking);
            responseData.setData(updatedBooking);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }catch(Error e){
            ResponseData<Booking> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }
}
