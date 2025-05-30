package com.apiLibrary.apiLibrary.dto;

import com.apiLibrary.apiLibrary.model.enums.OrderStatus; // Assuming OrderStatus enum is used
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
// import java.math.BigDecimal; // If using BigDecimal for totalAmount

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;
    private Long userId;
    private LocalDateTime orderDate;
    private Double totalAmount; // Using Double for consistency
    private OrderStatus status; // Or String if not using enum

    // Shipping Address Details
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingPostalCode;
    private String shippingCountry;

    private List<OrderItemResponseDto> items;
}
