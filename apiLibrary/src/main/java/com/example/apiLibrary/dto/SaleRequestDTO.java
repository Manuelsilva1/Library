package com.example.apiLibrary.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class SaleRequestDTO {

    @NotNull(message = "Seller ID cannot be null")
    private Long sellerId;

    private String customerName; // Optional

    @NotEmpty(message = "Sale items cannot be empty")
    @Valid // This will trigger validation for each SaleItemDTO if it has annotations
    private List<SaleItemDTO> items;
}
