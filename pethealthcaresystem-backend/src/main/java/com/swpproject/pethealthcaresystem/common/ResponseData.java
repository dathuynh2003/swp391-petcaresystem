package com.swpproject.pethealthcaresystem.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseData<T> {
    private int statusCode;
    private String errorMessage;
    private T data = null;
}
