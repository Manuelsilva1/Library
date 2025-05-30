package com.example.apiLibrary.controller;

import com.example.apiLibrary.dto.LoginRequest;
import com.example.apiLibrary.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginSeller(@Valid @RequestBody LoginRequest loginRequest) {
        String jwtToken = authService.loginSeller(loginRequest);
        // Return the token in a simple JSON structure: {"token": "your_jwt_token_here"}
        return ResponseEntity.ok(Map.of("token", jwtToken));
    }
}
