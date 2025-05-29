package com.apiLibrary.apiLibrary.controller;

import com.apiLibrary.apiLibrary.dto.AuthResponseDto;
import com.apiLibrary.apiLibrary.dto.UserLoginDto;
import com.apiLibrary.apiLibrary.dto.UserRegistrationDto;
import com.apiLibrary.apiLibrary.model.User;
import com.apiLibrary.apiLibrary.service.AuthService;
// Import custom exceptions if they are in a different package and public
// For example: import com.apiLibrary.apiLibrary.service.UserAlreadyExistsException;
// import com.apiLibrary.apiLibrary.service.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto registrationDto) {
        try {
            User registeredUser = authService.registerUser(registrationDto);
            // You might want to return a UserDto instead of the User entity directly
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (RuntimeException e) { // Catching the custom UserAlreadyExistsException from AuthService
            // It's better to have specific exception handling here
            // For now, a generic handler:
            if (e.getMessage().contains("already exists")) {
                 throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error during registration", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> loginUser(@RequestBody UserLoginDto loginDto) {
        try {
            AuthResponseDto authResponse = authService.loginUser(loginDto);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) { // Catching the custom AuthenticationException from AuthService
             if (e.getMessage().contains("Invalid credentials")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage(), e);
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error during login", e);
        }
    }
}
