package com.example.apiLibrary.exception;

import com.example.apiLibrary.dto.ApiErrorDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ApiErrorDTO createErrorDTO(HttpStatus status, String message, List<String> errors, WebRequest request) {
        return new ApiErrorDTO(
                LocalDateTime.now(),
                status.value(),
                message,
                errors,
                request.getDescription(false) // Example of getting path, remove "uri=" prefix
                        .replace("uri=", "")
        );
    }
    
    private ApiErrorDTO createErrorDTO(HttpStatus status, String message, String error, WebRequest request) {
        return createErrorDTO(status, message, Collections.singletonList(error), request);
    }


    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<ApiErrorDTO> handleBookNotFoundException(BookNotFoundException ex, WebRequest request) {
        ApiErrorDTO apiError = createErrorDTO(HttpStatus.NOT_FOUND, "Book Not Found", ex.getMessage(), request);
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiErrorDTO> handleInsufficientStockException(InsufficientStockException ex, WebRequest request) {
        ApiErrorDTO apiError = createErrorDTO(HttpStatus.BAD_REQUEST, "Insufficient Stock", ex.getMessage(), request);
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiErrorDTO> handleUsernameNotFoundException(UsernameNotFoundException ex, WebRequest request) {
        // Note: UsernameNotFoundException typically implies user doesn't exist during authentication attempt.
        // Returning 401 is common as it's an authentication failure.
        ApiErrorDTO apiError = createErrorDTO(HttpStatus.UNAUTHORIZED, "Authentication Failed", ex.getMessage(), request);
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorDTO> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        ApiErrorDTO apiError = createErrorDTO(HttpStatus.UNAUTHORIZED, "Authentication Failed", "Invalid username or password", request);
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDTO> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> validationErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        ex.getBindingResult().getGlobalErrors().forEach(error ->
                validationErrors.add(error.getObjectName() + ": " + error.getDefaultMessage())
        );
        ApiErrorDTO apiError = createErrorDTO(HttpStatus.BAD_REQUEST, "Validation Failed", validationErrors, request);
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDTO> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        ApiErrorDTO apiError = createErrorDTO(HttpStatus.BAD_REQUEST, "Invalid Argument", ex.getMessage(), request);
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorDTO> handleGenericException(Exception ex, WebRequest request) {
        LOGGER.error("An unexpected error occurred: ", ex); // Log the full stack trace for debugging
        ApiErrorDTO apiError = createErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR, "An Unexpected Error Occurred", "Please contact support.", request);
        // For security reasons, don't expose ex.getMessage() directly for generic exceptions unless it's safe.
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
