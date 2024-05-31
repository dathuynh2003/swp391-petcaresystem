package com.swpproject.pethealthcaresystem.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class VerifyCodeService implements IVerifyCodeService{
    private final String CHARACTER = "0123456789";
    private final int CODE_LENGHT = 6;
    private final SecureRandom RANDOM = new SecureRandom();
    private final Map<String, String> verificationCodes = new HashMap<String, String>();


    @Override
    public String generateVerifyCode(String email) {
        StringBuilder code = new StringBuilder(CODE_LENGHT);
        for (int i = 0; i < CODE_LENGHT; i++){
            code.append(CHARACTER.charAt(RANDOM.nextInt(CHARACTER.length())));
        }

        verificationCodes.put(email, code.toString());
        return code.toString();
    }

    @Override
    public String getVerifyCode(String email) {
        return verificationCodes.get(email);
    }

    @Override
    public void removeVerifyCode(String email) {
        verificationCodes.remove(email);
    }


}
