package com.swpproject.pethealthcaresystem.service;

public interface IVerifyCodeService {
    public String generateVerifyCode(String email);
    public String getVerifyCode(String email);
    public void removeVerifyCode(String email);
}
