package com.example.apiLibrary.model;

import lombok.Data;

@Data
public class SaleItem {

    private Long bookId;
    private Integer quantity;

    // All-args constructor
    public SaleItem(Long bookId, Integer quantity) {
        this.bookId = bookId;
        this.quantity = quantity;
    }

    // No-args constructor (often required by frameworks)
    public SaleItem() {
    }
}
