package com.example.apiLibrary.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SaleResponseDTO {
    private Long saleId;
    private LocalDateTime timestamp;
    private BigDecimal totalAmount;
    // Could also include a list of SaleItemDTOs if needed for the response
}
