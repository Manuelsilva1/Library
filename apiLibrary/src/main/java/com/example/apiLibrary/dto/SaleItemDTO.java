package com.example.apiLibrary.dto;

import lombok.Data;
// Similar to OrderItemDTO, validation can be added here if needed.
// e.g. @NotNull for bookId, @Min(1) for quantity

@Data
public class SaleItemDTO {
    private Long bookId;
    private Integer quantity;
}
