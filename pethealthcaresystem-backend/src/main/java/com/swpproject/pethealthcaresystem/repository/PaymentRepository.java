package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.Hospitalization;
import com.swpproject.pethealthcaresystem.model.MedicalRecord;
import com.swpproject.pethealthcaresystem.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Payment findByOrderCode(int orderCode);
    Payment findByHospitalization(Hospitalization hospitalization);
    Payment findByMedicalRecord(MedicalRecord medicalRecord);

    List<Payment> findByPaymentDateBetween(Date startDate, Date endDate);


}
