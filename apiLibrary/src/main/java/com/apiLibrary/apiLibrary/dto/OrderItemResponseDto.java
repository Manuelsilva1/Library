package com.apiLibrary.apiLibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// import java.math.BigDecimal; // If using BigDecimal for price

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponseDto {
    private Long bookId;
    private String bookTitle;
    private int quantity;
    private Double priceAtPurchase; // Using Double for consistency
}
