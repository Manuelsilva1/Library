package com.example.apiLibrary.model;

import lombok.Data;
// No specific Spring Data annotations needed here if it's to be embedded or handled by the Order entity's mapping.
// If it were a separate table with a foreign key to Order and its own ID, it would be different.
// For Spring Data JDBC, when OrderItem is part of a List in Order and mapped with @MappedCollection,
// it's treated as a related entity, and its fields are mapped to columns in a table often named after the OrderItem entity
// or as specified in @Table if it were a top-level entity.
// The key here is how it's referenced in the Order entity.

@Data
public class OrderItem {

    // Assuming this OrderItem is part of an Order and its table will have a foreign key to the Order.
    // It might also have its own ID if it were a standalone table, but for @MappedCollection,
    // the framework handles its persistence as part of the Order.
    // The 'bookId' links to the Book entity.
    private Long bookId;
    private Integer quantity;

    // Constructors, if needed, can be added. Lombok's @Data provides an all-args constructor.
    // An explicit all-args constructor or a constructor with (Long bookId, Integer quantity) might be useful.
    public OrderItem(Long bookId, Integer quantity) {
        this.bookId = bookId;
        this.quantity = quantity;
    }

    // Lombok's @Data also provides a no-args constructor if there are no final fields initialized inline.
    // Spring Data often requires a no-args constructor.
    public OrderItem() {
    }
}
