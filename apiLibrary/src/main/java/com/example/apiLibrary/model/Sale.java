package com.example.apiLibrary.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Table("SALES")
public class Sale {

    @Id
    private Long saleId;
    private Long sellerId; // References User.id
    private String customerName; // Optional
    private LocalDateTime timestamp;
    private BigDecimal totalAmount;

    // Assuming the SaleItem table will have a "SALE_ID" column linking back to this Sale.
    @MappedCollection(idColumn = "SALE_ID")
    private List<SaleItem> items;
}
