package com.swpproject.pethealthcaresystem.dto.payment;

import com.swpproject.pethealthcaresystem.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayOsDTO {
    private String code;
    private String desc;
    private PayOsData data;

}
