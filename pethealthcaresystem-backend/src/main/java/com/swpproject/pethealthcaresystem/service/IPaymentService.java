package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPaymentService {
    Payment createPayment(Payment payment);
}
