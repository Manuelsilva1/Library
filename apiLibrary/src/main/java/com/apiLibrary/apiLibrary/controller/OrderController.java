package com.apiLibrary.apiLibrary.controller;

import com.apiLibrary.apiLibrary.dto.CreateOrderRequestDto;
import com.apiLibrary.apiLibrary.dto.OrderResponseDto;
import com.apiLibrary.apiLibrary.exception.InsufficientStockException;
import com.apiLibrary.apiLibrary.model.User;
import com.apiLibrary.apiLibrary.repository.UserRepository;
import com.apiLibrary.apiLibrary.service.OrderService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository; // To fetch User by email from Principal

    @Autowired
    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for email: " + email + ". Token might be invalid or user deleted."));
    }

    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(
            @Valid @RequestBody CreateOrderRequestDto requestDto,
            Authentication authentication) {
        try {
            User authenticatedUser = getAuthenticatedUser(authentication);
            OrderResponseDto createdOrder = orderService.createOrder(requestDto, authenticatedUser.getId());
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (UsernameNotFoundException | EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (InsufficientStockException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (SecurityException e) { // Should not happen here, but for completeness
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrdersForCurrentUser(Authentication authentication) {
        try {
            User authenticatedUser = getAuthenticatedUser(authentication);
            List<OrderResponseDto> orders = orderService.getOrdersByUserId(authenticatedUser.getId());
            return ResponseEntity.ok(orders);
        } catch (UsernameNotFoundException e) {
             // This case implies the user from token was not found, which is an auth issue.
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderDetails(
            @PathVariable Long orderId,
            Authentication authentication) {
        try {
            User authenticatedUser = getAuthenticatedUser(authentication);
            OrderResponseDto orderDetails = orderService.getOrderDetails(orderId, authenticatedUser.getId());
            return ResponseEntity.ok(orderDetails);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (UsernameNotFoundException e) {
            // This case implies the user from token was not found, which is an auth issue.
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage(), e);
        } catch (SecurityException e) {
            // This means user is trying to access an order that is not theirs
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        }
    }
}
