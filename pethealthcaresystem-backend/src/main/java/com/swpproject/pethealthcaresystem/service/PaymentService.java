package com.swpproject.pethealthcaresystem.service;

import com.fasterxml.jackson.core.io.JsonEOFException;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.swpproject.pethealthcaresystem.dto.payment.CreatePaymentPosPayload;
import com.swpproject.pethealthcaresystem.dto.payment.PayOsDTO;
import com.swpproject.pethealthcaresystem.model.BookingDetail;
import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.repository.PaymentRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.json.JSONObject;
import org.apache.commons.codec.digest.HmacUtils;

import java.util.*;

@Service
public class PaymentService implements IPaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public static final String checksumKey = "03e871a48be196cfc46e79c416c3453a6187a04e4c9ab18e69636a0c864e761a";
    public static final String clientId = "f4637ee4-2474-4a0b-8f55-feae7c6f2420";
    public static final String apiKey = "1b4957b4-8989-46fd-8154-e37cd0ea0783";

    private String createSignaturePayOs(String transaction) throws JSONException {

        String signature = new HmacUtils("HmacSHA256", this.checksumKey).hmacHex(transaction);
        return signature;
    }

    private static Iterator<String> sortedIterator(Iterator<?> it, Comparator<String> comparator) {
        List<String> list = new ArrayList<String>();
        while (it.hasNext()) {
            list.add((String) it.next());
        }

        Collections.sort(list, comparator);
        return list.iterator();
    }

    public CreatePaymentPosPayload createPaymentOs(Payment payment) {
        try {
            Random rand = new Random();
            int orderCode = (int) rand.nextInt(1000000) + 1;
            System.out.println(orderCode);
            CreatePaymentPosPayload payload = new CreatePaymentPosPayload();

            payload.setOrderCode(orderCode);
            System.out.println(payment);
            System.out.println(payment.getBooking().getTotalAmount());
            payload.setAmount((int) payment.getBooking().getTotalAmount());
            System.out.println("-----");
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

            payload.setCancelUrl("http://localhost:3000");
            payload.setReturnUrl("http://localhost:3000");

//            String transaction = String.format("amount:%x,cancelUrl:%s,description:%s,orderCode:%x,returnUrl:%s",
//                    payload.getAmount(),
//                    payload.getCancelUrl(),
//                    payload.getDescription(),
//                    payload.getOrderCode(),
//                    payload.getReturnUrl());
//            System.out.println(transaction);
            String transaction = "amount="+payload.getAmount()+
                    "&cancelUrl="+payload.getCancelUrl() +
                    "&description="+ payload.getDescription() +
                    "&orderCode="+ payload.getOrderCode() +
                    "&returnUrl=" + payload.getReturnUrl();
            String signature = this.createSignaturePayOs(transaction);
            System.out.println(signature);
            payload.setSignature(signature);

            return payload;
        }catch (Exception error) {
            throw new Error(error.getMessage());
        }
    }
}
