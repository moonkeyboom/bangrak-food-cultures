package com.bangrak.foodcultures.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminLoginResponse {
    private boolean success;
    private String token;
}
