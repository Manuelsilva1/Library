package com.apiLibrary.apiLibrary.service;

import com.apiLibrary.apiLibrary.dto.AuthResponseDto;
import com.apiLibrary.apiLibrary.dto.UserInfoDto; // Import UserInfoDto
import com.apiLibrary.apiLibrary.dto.UserLoginDto;
import com.apiLibrary.apiLibrary.dto.UserRegistrationDto;
import com.apiLibrary.apiLibrary.model.Role; // Import Role
import com.apiLibrary.apiLibrary.model.User;
import com.apiLibrary.apiLibrary.repository.UserRepository;
import com.apiLibrary.apiLibrary.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List; // Import List
import java.util.Optional;
import java.util.stream.Collectors; // Import Collectors

// Custom Exceptions (basic implementation)
class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}

class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
}

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // Inject JwtTokenProvider

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) { // Add JwtTokenProvider
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider; // Initialize JwtTokenProvider
    }

    public User registerUser(UserRegistrationDto registrationDto) {
        Optional<User> existingUser = userRepository.findByEmail(registrationDto.getEmail());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("User with email " + registrationDto.getEmail() + " already exists.");
        }

        User newUser = new User();
        newUser.setFullName(registrationDto.getFullName());
        newUser.setEmail(registrationDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(registrationDto.getPassword())); // Hash password

        return userRepository.save(newUser);
    }

    public AuthResponseDto loginUser(UserLoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid credentials. User not found."));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) { // Compare hashed password
            throw new AuthenticationException("Invalid credentials. Password mismatch.");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        
        UserInfoDto userInfoDto = new UserInfoDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                roleNames
        );

        return new AuthResponseDto("Login successful", userInfoDto, token);
    }
}
