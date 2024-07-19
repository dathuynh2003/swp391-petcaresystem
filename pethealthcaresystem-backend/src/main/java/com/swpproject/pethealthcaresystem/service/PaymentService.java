package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.dto.payment.CreatePaymentPosPayload;
import com.swpproject.pethealthcaresystem.model.*;
import com.swpproject.pethealthcaresystem.repository.*;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentService implements IPaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private HospitalizationRepository hospitalizationRepository;

    @Value("${custom.url}")
    private String url;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

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

    /**
     * This method
     *
     * @return
     */
    @Override
    public List<Payment> getPaymentList() {
        return paymentRepository.findAll();
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
            payload.setItems(new ArrayList<>());
            payload.setCancelUrl(url + "/payment-result");
            payload.setReturnUrl(url + "/payment-result");
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
    @Override
    @Transactional
    public Map<String, Object> createPayLoad(Payment payment, int hospId) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        int orderCode = new Random().nextInt(1000000) + 1;

        payload.put("orderCode", orderCode);
        payload.put("amount", (int) payment.getAmount());
        payload.put("description", "Paymentorder" + orderCode);
        Hospitalization hosp = hospitalizationRepository.findById(hospId)
                .orElseThrow(() -> new Exception("Hospitalzation not found"));
        payload.put("cancelUrl", url + "/viewPet/" + hosp.getPet().getPetId());
//        System.out.println(url + "/viewPet/" + hosp.getPet().getPetId());
        payload.put("returnUrl", url + "/viewPet/" + hosp.getPet().getPetId());

        Payment updatePayment = paymentRepository.findByHospitalization(hosp);
        if (updatePayment == null) {
            throw new Exception("Cannot find payment info match with hospitalization");
        }
        updatePayment.setOrderCode(orderCode);
        updatePayment.setAmount(payment.getAmount());
        paymentRepository.save(updatePayment);

        String transaction = "amount=" + payload.get("amount") +
                "&cancelUrl=" + payload.get("cancelUrl") +
                "&description=" + payload.get("description") +
                "&orderCode=" + payload.get("orderCode") +
                "&returnUrl=" + payload.get("returnUrl");

        String signature = this.createSignaturePayOs(transaction);
        payload.put("signature", signature);

        return payload;
    }

    @Override
    @Transactional
    public Payment updatePayment(int orderCode, Payment payment) throws Exception {
        Payment updatePayment = paymentRepository.findByOrderCode(orderCode);
        System.out.println("Payment info: " + payment);
        if (payment == null) {
            throw new Error("Cannot find payment info match with orderCode");
        }
        updatePayment.setStatus(payment.getStatus());
        updatePayment.setPaymentType(payment.getPaymentType());
        Date now = new Date();
        updatePayment.setPaymentDate(now);
        paymentRepository.save(updatePayment);

//        Hospitalization hosp = hospitalizationRepository.findById(updatePayment.getHospitalization().getId())
//                .orElseThrow(() -> new Exception("Unable to update pet's hospitalization status"));
//        hosp.setStatus("discharged");
        Hospitalization hosp = updatePayment.getHospitalization();
        MedicalRecord medicalRecord = updatePayment.getMedicalRecord();
        if (hosp == null && medicalRecord == null) {
            throw new Exception("Unable to update pet's hospitalization and medical record status");
        }
        if (hosp != null) {
            Hospitalization tmp = hospitalizationRepository.findById(hosp.getId()).orElseThrow(() -> new Exception("Unable to update pet's hospitalization status"));
            tmp.setStatus("discharged");
            hospitalizationRepository.save(tmp);
        }
        if (medicalRecord != null) {
            medicalRecord.setIsPaid(true);
        }

        return updatePayment;
    }

    @Override
    public Payment createMedicalPayment(Payment payment, int medicalRecordId) throws Exception {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId).get();
        Payment tmpPayment = paymentRepository.findByMedicalRecord(medicalRecord);
        if (tmpPayment == null) {
            payment.setMedicalRecord(medicalRecord);
            paymentRepository.save(payment);
        }

        return paymentRepository.save(payment);
    }


    public Map<String, Object> createPayLoadMedicalRecord(Payment payment, int medicalRecordId) throws Exception {

//        if(payment1 == null) {}
        Map<String, Object> payload = new HashMap<>();
        int orderCode = new Random().nextInt(1000000) + 1;


        payload.put("orderCode", orderCode);
        payload.put("amount", (int) payment.getAmount());
        payload.put("description", "Paymentorder" + orderCode);
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new Exception("Medical Record not found"));
        payload.put("cancelUrl", url + "/viewPet/" + medicalRecord.getPet().getPetId());
//        System.out.println( url + "/viewPet/" + medicalRecord.getPet().getPetId());
        payload.put("returnUrl",  url + "/viewPet/" + medicalRecord.getPet().getPetId());

        //neu payment da co medicalRecrord ID
        Payment updatePayment = paymentRepository.findByMedicalRecord(medicalRecord);
        if (updatePayment == null) {
//            throw new Exception("Cannot find payment info match with medical record");
            updatePayment = new Payment();
            updatePayment.setMedicalRecord(medicalRecord);
            updatePayment.setUser(medicalRecord.getUser());
        }
        updatePayment.setPaymentType(payment.getPaymentType());

        updatePayment.setOrderCode(orderCode);
        updatePayment.setAmount(payment.getAmount());
        paymentRepository.save(updatePayment);


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
