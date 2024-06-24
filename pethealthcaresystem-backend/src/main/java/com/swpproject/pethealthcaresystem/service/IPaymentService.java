package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Payment;
import com.swpproject.pethealthcaresystem.model.User;
import org.json.JSONException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Map;

public interface IPaymentService {
    Payment createPayment(Payment payment);

    Payment updatePayment(Payment payment);

    Payment getPaymentByOrderCode(int orderCode);

    //Dùng Map thay vì CreatePaymentPosPayload
    Map<String, Object> createPayLoad(Payment payment, int hospId) throws Exception;

    Payment updatePayment(int orderCode, Payment payment) throws Exception;
}
