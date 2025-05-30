package com.example.apiLibrary.service;

import com.example.apiLibrary.dto.LoginRequest;

public interface AuthService {
    String loginSeller(LoginRequest loginRequest);
}
