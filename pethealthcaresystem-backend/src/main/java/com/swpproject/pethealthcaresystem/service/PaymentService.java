package com.swpproject.pethealthcaresystem.service;

import com.fasterxml.jackson.core.io.JsonEOFException;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.swpproject.pethealthcaresystem.dto.payment.CreatePaymentPosPayload;
import com.swpproject.pethealthcaresystem.dto.payment.PayOsDTO;
import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.BookingDetail;
import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.repository.BookingRepository;
import com.swpproject.pethealthcaresystem.repository.PaymentRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.json.JSONObject;
import org.apache.commons.codec.digest.HmacUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentService implements IPaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingRepository bookingRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy");

    @Override
    public Payment createPayment(Payment payment) {
//        System.out.println("Payment Booking" + payment.getBooking());
//        Booking curBooking = bookingRepository.findById(payment.getBooking().getId()).get();
//        System.out.println(curBooking);
        Booking curBooking = bookingRepository.findById(payment.getBooking().getId()).orElseThrow(() ->
                new RuntimeException("Booking not found"));
        payment.setBooking(curBooking);
        return paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(Payment payment) {
        // Find the existing payment by order code
        Payment existingPayment = paymentRepository.findByOrderCode(payment.getOrderCode());

        if (existingPayment != null) {
            // Update the status of the payment
            existingPayment.setStatus(payment.getStatus());

            // Get the associated booking
            Booking booking = existingPayment.getBooking();
            if (booking != null) {
                // Update the booking status
                booking.setStatus(payment.getStatus());

                // Get the associated vet shift detail
                VetShiftDetail vetShiftDetail = booking.getVetShiftDetail();
                if (vetShiftDetail != null) {
                    if (payment.getStatus().equals("CANCELLED")) {
                        // Set the vet shift status to "Available" if the payment is cancelled
                        vetShiftDetail.setStatus("Available");
                    } else {
                        // Set the vet shift status to "Booked" if the payment is confirmed
                        vetShiftDetail.setStatus("Booked");
                    }
                }
                // Set the payment ID on the booking
                booking.setPaymentId(existingPayment.getId());

                // Save the updated booking
                bookingRepository.save(booking);
            }

            // Save the updated payment
            existingPayment = paymentRepository.save(existingPayment);
        } else {
            throw new RuntimeException("Payment with order code " + payment.getOrderCode() + " not found.");
        }

        return existingPayment;
    }


    @Override
    public Payment getPaymentByOrderCode(int orderCode) {
        Payment payment = paymentRepository.findByOrderCode(orderCode);
        return payment;
    }

    public static final String checksumKey = "03e871a48be196cfc46e79c416c3453a6187a04e4c9ab18e69636a0c864e761a";
    public static final String clientId = "f4637ee4-2474-4a0b-8f55-feae7c6f2420";
    public static final String apiKey = "1b4957b4-8989-46fd-8154-e37cd0ea0783";

    private String createSignaturePayOs(String transaction) throws JSONException {

        String signature = new HmacUtils("HmacSHA256", this.checksumKey).hmacHex(transaction);
        return signature;
    }


    public CreatePaymentPosPayload createPaymentOs(Payment payment) {
        try {
            Random rand = new Random();
            int orderCode = (int) rand.nextInt(1000000) + 1;
            System.out.println(orderCode);
            CreatePaymentPosPayload payload = new CreatePaymentPosPayload();

            payload.setOrderCode(orderCode);
            payload.setAmount((int) payment.getBooking().getTotalAmount());
            payload.setBuyerEmail(payment.getUser().getEmail());
            payload.setDescription("Paymentorder" + orderCode);
            payload.setBuyerPhone(payment.getUser().getPhoneNumber());
            payload.setBuyerName(payment.getUser().getFullName());
            payload.setBuyerAddress(payment.getUser().getAddress());

//        List<Map<String, Object>> items = new ArrayList<>();
//        for (int i = 0; i < payment.getBooking().getBookingDetails().size(); i++) {
//            BookingDetail bookingDetail = payment.getBooking().getBookingDetails().get(i);
//            Map<String, Object> item = new HashMap<>();
//            item.put("name", bookingDetail.getPetService().getNameService());
//            item.put("quantity", 1);
//            item.put("price", bookingDetail.getPetService().getPrice());
//            items.add(item);
//        }
            payload.setItems(new ArrayList<>());

            payload.setCancelUrl("http://localhost:3000/payment-result");
            payload.setReturnUrl("http://localhost:3000/payment-result");

//            String transaction = String.format("amount:%x,cancelUrl:%s,description:%s,orderCode:%x,returnUrl:%s",
//                    payload.getAmount(),
//                    payload.getCancelUrl(),
//                    payload.getDescription(),
//                    payload.getOrderCode(),
//                    payload.getReturnUrl());
//            System.out.println(transaction);
            String transaction = "amount=" + payload.getAmount() +
                    "&cancelUrl=" + payload.getCancelUrl() +
                    "&description=" + payload.getDescription() +
                    "&orderCode=" + payload.getOrderCode() +
                    "&returnUrl=" + payload.getReturnUrl();
            String signature = this.createSignaturePayOs(transaction);
            payload.setSignature(signature);

            return payload;
        } catch (Exception error) {
            throw new Error(error.getMessage());
        }
    }

    //Dùng Map thay vì CreatePaymentPosPayload
    public Map<String, Object> createPayLoad(Payment payment) throws JSONException {
        Map<String, Object> payload = new HashMap<>();
        int orderCode = new Random().nextInt(1000000) + 1;

        payload.put("orderCode", orderCode);
        payload.put("amount", (int) payment.getAmount());
        payload.put("description", "Paymentorder" + orderCode);

        payload.put("cancelUrl", "");
        payload.put("returnUrl", "");

        String transaction = "amount=" + payload.get("amount") +
                "&cancelUrl=" + payload.get("cancelUrl") +
                "&description=" + payload.get("description") +
                "&orderCode=" + payload.get("orderCode") +
                "&returnUrl=" + payload.get("returnUrl");

        String signature = this.createSignaturePayOs(transaction);
        payload.put("signature", signature);

        return payload;
    }


}
