package com.example.apiLibrary.service.impl;

import com.example.apiLibrary.dto.LoginRequest;
import com.example.apiLibrary.model.User;
import com.example.apiLibrary.repository.UserRepository;
import com.example.apiLibrary.security.JwtTokenProvider;
import com.example.apiLibrary.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService; // Spring's UserDetailsService

    @Autowired
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public String loginSeller(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + loginRequest.getUsername());
        }

        User user = userOptional.get();

        // Password comparison using PasswordEncoder
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Passwords match

            // Load UserDetails to get authorities and create Authentication object
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null, // Credentials (password) not needed here as user is already authenticated
                    userDetails.getAuthorities()
            );

            // TODO: Check user roles if necessary (e.g., ensure user is a SELLER from userDetails.getAuthorities())
            // For example:
            // boolean isSeller = userDetails.getAuthorities().stream()
            // .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_SELLER"));
            // if (!isSeller) {
            // throw new org.springframework.security.access.AccessDeniedException("User does not have SELLER role");
            // }

            return jwtTokenProvider.generateToken(authentication); // Generate token from Authentication
        } else {
            // Passwords do not match
            throw new BadCredentialsException("Invalid username or password."); // Generic message for security
        }
    }
}
