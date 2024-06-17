package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.HospitalizationDetail;
import com.swpproject.pethealthcaresystem.repository.HospitalizationDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HospitalizationDetailService implements IHospitalizationDetailService {
    @Autowired
    private HospitalizationDetailRepository hospitalizationDetailRepository;

}
