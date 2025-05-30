package com.example.apiLibrary.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.util.List;
import java.util.Set; // Using Set for items to avoid duplicates by default if applicable, List is also fine.
                     // Task specified List, so using List.

@Data
@Table("ORDERS")
public class Order {

    @Id
    private Long orderId;
    private String customerName;
    private String customerEmail;
    private String status; // e.g., "CREATED", "PROCESSING", "SHIPPED", "FAILED"

    // Assuming the OrderItem table will have an "ORDER_ID" column linking back to this Order.
    @MappedCollection(idColumn = "ORDER_ID")
    private List<OrderItem> items;
    // Note: For @MappedCollection to work effectively, OrderItem typically needs to be a distinct table
    // with a foreign key (ORDER_ID in this case) pointing back to the ORDERS table.
    // The OrderItem class itself doesn't need an @Id if it's purely a dependent entity.
}
