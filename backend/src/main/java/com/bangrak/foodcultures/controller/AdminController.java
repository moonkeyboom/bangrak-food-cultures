package com.bangrak.foodcultures.controller;

import com.bangrak.foodcultures.dto.AdminLoginRequest;
import com.bangrak.foodcultures.dto.AdminLoginResponse;
import com.bangrak.foodcultures.dto.VerifyAdminResponse;
import com.bangrak.foodcultures.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed.origins}")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {
        AdminLoginResponse response = adminService.login(request.getPassword());
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<VerifyAdminResponse> verify(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            VerifyAdminResponse response = adminService.verifyToken(token);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(new VerifyAdminResponse(false));
    }
}
