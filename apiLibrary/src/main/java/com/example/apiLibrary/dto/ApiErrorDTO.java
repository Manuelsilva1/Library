package com.example.apiLibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiErrorDTO {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private List<String> errors;
    private String path; // Optional: Can be populated from WebRequest

    // Constructor without path for convenience
    public ApiErrorDTO(LocalDateTime timestamp, int status, String message, List<String> errors) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}
