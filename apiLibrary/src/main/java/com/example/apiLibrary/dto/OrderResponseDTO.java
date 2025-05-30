package com.example.apiLibrary.dto;

import lombok.Data;

@Data
public class OrderResponseDTO {
    private Long orderId;
    private String status;
    private String message; // e.g., "Order created successfully" or details of an error if applicable
}
