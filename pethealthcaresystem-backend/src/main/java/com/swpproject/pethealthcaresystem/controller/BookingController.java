package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.BookingDetail;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.BookingService;
import com.swpproject.pethealthcaresystem.utils.SystemUtils;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")


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
            return bookingService.createBookingByUser(booking, user, petId, vsId, serviceIds);


        } catch (RuntimeException e) {
            return null;
        }
    }

    @PostMapping("/createBookingByUser/pet/{petId}/vet-shift/{vsId}/services/{serviceIds}")
    public ResponseEntity<ResponseData> createBookingByUser(
            @RequestBody Booking booking,
            @PathVariable int petId,
            @PathVariable int vsId,
            @PathVariable List<Integer> serviceIds,
            HttpSession session) {
        ResponseData<Booking> responseData = new ResponseData<>();
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);
            }
            Booking createdBooking = bookingService.createBookingByUser(booking, user, petId, vsId, serviceIds);
            responseData.setData(createdBooking);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setStatusCode(404);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update-booking")
    public ResponseEntity<ResponseData> updateBooking(@RequestBody Booking booking) {
        try {
            ResponseData<Booking> responseData = new ResponseData<>();
            Booking updatedBooking = bookingService.updateBoking(booking);
            responseData.setData(updatedBooking);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Error e) {
            ResponseData<Booking> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/createBookingByStaff/pet/{petId}/vet-shift/{vsId}/services/{serviceIds}")
    public Booking createBookingByStaff(@RequestBody Booking booking, @PathVariable int petId, @PathVariable int vsId, @PathVariable List<Integer> serviceIds, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return null;
            }
            return bookingService.createBookingByStaff(booking, petId, vsId, serviceIds);
        } catch (RuntimeException e) {
            return null;
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<ResponseData> getAllBookings(HttpSession session) {
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser != null) {
                ResponseData<List<Booking>> responseData = new ResponseData<>();
                List<Booking> bookings = bookingService.getAllBookings(currentUser);
                responseData.setData(bookings);
                responseData.setStatusCode(200);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            ResponseData<Booking> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-booking/{id}/details")
    public ResponseEntity<ResponseData> getBookingDetail(@PathVariable int id) {
        try {
            ResponseData<List<BookingDetail>> responseData = new ResponseData<>();
            List<BookingDetail> bookingDetails = bookingService.bookingDetail(id);
            responseData.setData(bookingDetails);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);

        } catch (RuntimeException e) {
            ResponseData<BookingDetail> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/bookings-staff")
    public ResponseEntity<ResponseData> getBookingsByStaff(
            HttpSession session,
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize") Integer pageSize,
            @RequestParam(name = "phoneNumber", required = false) String phoneNumber) {
        try {
            System.out.println(phoneNumber);
            User currentUser = (User) session.getAttribute("user");
            if (currentUser != null) {
                ResponseData<Page<Booking>> responseData = new ResponseData<>();
                Page<Booking> bookings;
                if (phoneNumber != null) {
                    bookings = bookingService.getBookingsByPhone(pageNo, pageSize, phoneNumber);
                } else {
                    bookings = bookingService.getBookings(pageNo, pageSize);
                }
                responseData.setData(bookings);
                responseData.setStatusCode(200);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
        } catch (RuntimeException e) {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    // @GetMapping("/get-booking/{id}")
    // public ResponseEntity<ResponseData> getBooking(@PathVariable int id) {
    //     try {
    //         ResponseData<Booking> responseData = new ResponseData<>();
    //         Booking selectedBooking = bookingService.getBookingByID(id);
    //         responseData.setData(selectedBooking);
    //         responseData.setStatusCode(201);
    //         return new ResponseEntity<>(responseData, HttpStatus.OK);

    //     }catch (Exception e) {
    //         ResponseData<Booking> responseData = new ResponseData<>();
    //         responseData.setStatusCode(400);
    //         responseData.setErrorMessage(e.getMessage());
    //         return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    //     }
    // }

    @PutMapping("booking/paid")
    public ResponseEntity<Booking> updateBookingAfterPAID(@RequestBody Booking booking) {
        try {
            Booking updatedBooking = bookingService.updateBookingAfterPAID(booking);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PutMapping("booking/cancelled")
    public ResponseEntity<Booking> updateBookingAfterCANCELLED(@RequestBody Booking booking) {
        try {
            Booking updatedBooking = bookingService.updateBookingAfterCANCELLED(booking);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("all-bookings")
    public ResponseEntity<ResponseData> getAllBookings(
            HttpSession session,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam Integer pageSize
    ) {
        try {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            Page<Booking> bookings = bookingService.getBookings(pageNo, pageSize);
            responseData.setData(bookings);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/reservations")
    public ResponseEntity<ResponseData> getBookingsByUserAndStatus(
            HttpSession session,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam Integer pageSize) {
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser != null) {
                List<String> statuses = new ArrayList<>();
                statuses.add("PAID");
                statuses.add("Request Refund");
                statuses.add("Refunded");
                statuses.add("DONE");
                statuses.add("Checked_In");
                Page<Booking> bookings = bookingService.getBookingsByUserAndStatusIn(currentUser.getUserId(), statuses, pageNo, pageSize);
                ResponseData<Page<Booking>> responseData = new ResponseData<>();
                responseData.setData(bookings);
                responseData.setStatusCode(200);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("staff-bookings-status/{status}")
    public ResponseEntity<ResponseData> getBookingsByStaffAndStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam Integer pageSize,
            HttpSession session) {
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser != null) {
                ResponseData<Page<Booking>> responseData = new ResponseData<>();
                Page<Booking> bookings;
                bookings = bookingService.getBookingsByStatus(status, pageNo, pageSize);
                responseData.setData(bookings);
                responseData.setStatusCode(200);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);

        }
    }

    @GetMapping("staff-bookings-date")
    public ResponseEntity<ResponseData> getBookingsByStaffWithDate(
            HttpSession session,
            @RequestParam String fromDate,
            @RequestParam String toDate,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam Integer pageSize) {
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser != null) {
                ResponseData<Page<Booking>> responseData = new ResponseData<>();
                Page<Booking> bookings;
                Date from = SystemUtils.endOfDay(SystemUtils.parseStringToDate(fromDate));
                Date to = SystemUtils.endOfDay(SystemUtils.parseStringToDate(toDate));
                bookings = bookingService.getBookingByBookingDate(from, to, pageNo, pageSize);
                responseData.setData(bookings);
                responseData.setStatusCode(200);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);

        }
    }

    @GetMapping("staff-booking-date-status")
    public ResponseEntity<ResponseData> getBookingsByStaffWithDateStatusPhoneNumber(
            HttpSession session,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam Integer pageSize,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String status
    ) {
        try {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            User currentUser = (User) session.getAttribute("user");
            if (currentUser != null) {

                Page<Booking> bookings;
                bookings = bookingService.getBookingByStatusAndDate(status, fromDate, toDate, pageNo, pageSize);
                responseData.setData(bookings);
                responseData.setStatusCode(200);

                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            ResponseData<Page<Booking>> responseData = new ResponseData<>();
            responseData.setStatusCode(400);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }

    }

    @PutMapping("/refund/booking/{id}")
    public Map<String, Object> requestRefund(@PathVariable int id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                throw new Exception("You need login first");
            }
            response.put("booking", bookingService.requestRefundBooking(id));
            response.put("message", "successfully");
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @GetMapping("/get-bookings-by-status/{status}")
    public Map<String, Object> getBookingsByStatus(@PathVariable String status,
                                                   @RequestParam(defaultValue = "1") int page,
                                                   @RequestParam(defaultValue = "10") int size,
                                                   HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                throw new Exception("You need login first");
            }
            response.put("bookings", bookingService.getBookingsByStatus(status, page, size));
            response.put("message", "Successfully");
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/accept-refund/booking/{id}")
    public Map<String, Object> acceptRefund(@PathVariable int id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                throw new Exception("You need login first");
            }
            response.put("message", "successfully");
            response.put("booking", bookingService.acceptRefundBooking(id));
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/refuse-refund/booking/{id}")
    public Map<String, Object> refuseRefund(@PathVariable int id, @RequestParam String reason, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                throw new Exception("You need login first");
            }
            response.put("message", "successfully");
            response.put("booking", bookingService.refuseRefundBooking(id, reason));
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/refund-booking-by-staff/{bookingId}")
    public Map<String, Object> refundBooking(@PathVariable int bookingId, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                throw new Exception("You need login first");
            }
            response.put("message", "successfully");
            response.put("booking", bookingService.requestRefundBookingByStaff(bookingId));
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/finish-booking")
    public Map<String, Object> finishBooking(@RequestBody Booking completedBooking, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                throw new Exception("You need login first");
            }
            response.put("message", "successfully");
            response.put("booking", bookingService.finishBooking(completedBooking));
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @GetMapping("/upcoming-revisit-bookings")
    public Map<String, Object> getUpcomingRevisitBookings(HttpSession session,
                                                          @RequestParam(defaultValue = "1") Integer pageNo,
                                                          @RequestParam Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            User currentUser = (User) session.getAttribute("user");
            if (currentUser == null) {
                throw new Exception("You need login first");
            }
            response.put("message", "successfully");
            response.put("content", bookingService.getUpcomingRevisitBookings(pageNo, pageSize));
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }
}
