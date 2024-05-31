package com.swpproject.pethealthcaresystem.service;

public interface IMailService {
    public void sendMail(String toEmail, String subject, String body);
}
