package com.example.apiLibrary.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderDTO {
    private Long orderId;
    private String customerName;
    private String customerEmail;
    private String status;
    private List<OrderItemDTO> items; // Reusing OrderItemDTO for items list
    // Potentially add other fields from the Order entity if needed for the email,
    // e.g., total amount, order date, etc. For now, this matches the spec.
}
