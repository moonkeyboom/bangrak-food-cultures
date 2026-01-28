package com.bangrak.foodcultures.service;

import com.bangrak.foodcultures.dto.AdminLoginResponse;
import com.bangrak.foodcultures.dto.VerifyAdminResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Service
public class AdminService {

    @Value("${admin.password}")
    private String adminPassword;

    private String currentToken = null;

    public AdminLoginResponse login(String password) {
        if (adminPassword.equals(password)) {
            currentToken = Base64.getEncoder().encodeToString(
                UUID.randomUUID().toString().getBytes(StandardCharsets.UTF_8)
            );
            return new AdminLoginResponse(true, currentToken);
        }
        return new AdminLoginResponse(false, null);
    }

    public VerifyAdminResponse verifyToken(String token) {
        boolean valid = currentToken != null && currentToken.equals(token);
        return new VerifyAdminResponse(valid);
    }
}
