package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}